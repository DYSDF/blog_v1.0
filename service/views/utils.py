# coding: utf-8
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import QueryDict
from dss.Serializer import serializer


def get_base_result():
    result = {
        'success': False
    }
    return result


def get_base_pagination():
    return {
        'total': 0,
        'data': []
    }


def get_pagination_result(object_list, **kwargs):
    queries = QueryDict('').copy()
    queries.update(kwargs)

    result = get_base_pagination()

    # 获取分页参数
    page = queries.get('page', 1)
    rows = queries.get('rows', 10)

    # 建立分页实例
    paginator = Paginator(object_list, rows)
    try:
        objects = paginator.page(page)
    except PageNotAnInteger:
        objects = paginator.page(1)
    except EmptyPage:
        objects = paginator.page(paginator.num_pages)

    result.update({
        "page": page,
        "rows": rows,
        "total": len(object_list),
        "data": serializer(objects.object_list, foreign=True, many=True)
    })

    return result
