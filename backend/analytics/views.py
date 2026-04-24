from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .utils import read_csv_file
from .s3_utils import read_csv_from_s3


@api_view(['GET'])
def revenue(request):
    data = read_csv_from_s3("processed/gold_revenue_by_day/")
    return Response({"status": "success", "data": data})


@api_view(['GET'])
def top_tours(request):
    data = read_csv_from_s3("processed/gold_top_tours/")
    return Response({"status": "success", "data": data})


@api_view(['GET'])
def summary(request):
    data = read_csv_from_s3("processed/gold_summary/")
    return Response({
        "status": "success",
        "data": data[0] if data else {}
    })