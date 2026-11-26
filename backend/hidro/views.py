from datetime import timedelta

from django.db.models import Max
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Observation, Station
from .serializers import (
    SeriesQuerySerializer,
    SeriesSerializer,
    StationSerializer,
    SummarySerializer,
)

LEVEL = Observation.Metric.LEVEL
RAIN = Observation.Metric.RAIN


def estacoes_com_ultima_leitura():
    return Station.objects.annotate(last_observation_at=Max("observations__observed_at"))


def ultima_valida(estacao, metrica, ate):
    """Última leitura com valor válido (não nulo) de uma métrica."""
    return (
        Observation.objects.filter(
            station=estacao, metric=metrica, observed_at__lte=ate, value__isnull=False
        )
        .order_by("-observed_at")
        .first()
    )


class SimulatedDataView(APIView):
    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        response["X-Data-Source"] = "synthetic"
        return response


class StationListView(SimulatedDataView):
    @extend_schema(
        summary="Lista as estações",
        responses=StationSerializer(many=True),
        tags=["estações"],
    )
    def get(self, request):
        estacoes = estacoes_com_ultima_leitura()
        return Response(StationSerializer(estacoes, many=True).data)


class StationSummaryView(SimulatedDataView):
    @extend_schema(
        summary="Resumo das últimas leituras da estação",
        responses=SummarySerializer,
        tags=["estações"],
    )
    def get(self, request, station_id):
        estacao = get_object_or_404(estacoes_com_ultima_leitura(), pk=station_id)
        fim = estacao.last_observation_at

        def leitura(metrica):
            observacao = ultima_valida(estacao, metrica, fim) if fim else None
            if observacao is None:
                return {"value": None, "observed_at": None}
            return {"value": observacao.value, "observed_at": observacao.observed_at}

        dados = {
            "station": estacao,
            "last_observation_at": estacao.last_observation_at,
            "level_m": leitura(LEVEL),
            "rain_mm_h": leitura(RAIN),
        }
        return Response(SummarySerializer(dados).data)


class StationSeriesView(SimulatedDataView):
    @extend_schema(
        summary="Série histórica da estação (janela de 1 a 72 horas)",
        description=(
            "A janela termina na última leitura da estação e volta `hours` horas. "
            "Horários em UTC (ISO 8601 com Z). Leituras inválidas vêm como null."
        ),
        parameters=[
            OpenApiParameter("hours", int, description="1 a 72 (padrão 24)"),
            OpenApiParameter("metric", str, enum=["all", "level", "rain", "level_m", "rain_mm_h"]),
            OpenApiParameter("order", str, enum=["asc", "desc"]),
        ],
        responses=SeriesSerializer,
        tags=["estações"],
    )
    def get(self, request, station_id):
        estacao = get_object_or_404(estacoes_com_ultima_leitura(), pk=station_id)
        consulta = SeriesQuerySerializer(data=request.query_params)
        consulta.is_valid(raise_exception=True)
        horas = consulta.validated_data["hours"]
        filtro = consulta.validated_data["metric"]
        metrica = {"level": LEVEL, "rain": RAIN}.get(filtro, filtro)
        ordem = consulta.validated_data["order"]

        fim = estacao.last_observation_at
        inicio = fim - timedelta(hours=horas - 1) if fim else None
        metricas = [LEVEL, RAIN] if metrica == "all" else [metrica]

        pontos = {}
        if fim:
            leituras = Observation.objects.filter(
                station=estacao,
                observed_at__gte=inicio,
                observed_at__lte=fim,
                metric__in=metricas,
            ).values_list("observed_at", "metric", "value")
            for momento, nome, valor in leituras:
                ponto = pontos.setdefault(
                    momento, {"observed_at": momento, **{m: None for m in metricas}}
                )
                ponto[nome] = valor

        lista = sorted(pontos.values(), key=lambda p: p["observed_at"], reverse=ordem == "desc")
        dados = {
            "station_id": estacao.id,
            "hours": horas,
            "metric": filtro,
            "order": ordem,
            "start": inicio,
            "end": fim,
            "count": len(lista),
            "points": lista,
        }
        saida = SeriesSerializer(dados).data
        if metrica != "all":  # devolve só a métrica pedida
            for ponto in saida["points"]:
                ponto.pop(LEVEL if metrica == RAIN else RAIN, None)
        return Response(saida)
