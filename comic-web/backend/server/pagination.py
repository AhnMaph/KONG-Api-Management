from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class UnlimitedPagination(PageNumberPagination):
    page_size = 20
    page_query_param = 'page'
    page_size_query_param = 'limit'

    def paginate_queryset(self, queryset, request, view=None):
        limit = request.query_params.get(self.page_size_query_param)

        if limit == 'unlimited':
            self.is_unlimited = True
            self.unlimited_data = list(queryset)
            return None  # Disable pagination
        self.is_unlimited = False
        return super().paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        if self.is_unlimited:
            return Response(self.unlimited_data)
        return super().get_paginated_response(data)
