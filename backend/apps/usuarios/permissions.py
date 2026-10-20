from rest_framework.permissions import BasePermission


class IsMongoAuthenticated(BasePermission):
    """
    Permite acceso únicamente a usuarios autenticados con token válido de Mongo.
    """
    message = "Se requiere autenticación válida mediante token."

    def has_permission(self, request, view):
        return bool(request.user and getattr(request.user, 'is_authenticated', False))


class EsConductor(BasePermission):
    """Permiso exclusivo para usuarios con rol CONDUCTOR."""
    message = "Acceso restringido a conductores autorizados."

    def has_permission(self, request, view):
        return bool(
            request.user
            and getattr(request.user, 'is_authenticated', False)
            and getattr(request.user, 'rol', None) == 'CONDUCTOR'
        )


class EsPasajero(BasePermission):
    """Permiso exclusivo para usuarios con rol PASAJERO."""
    message = "Acceso restringido a pasajeros."

    def has_permission(self, request, view):
        return bool(
            request.user
            and getattr(request.user, 'is_authenticated', False)
            and getattr(request.user, 'rol', None) == 'PASAJERO'
        )


class EsAdmin(BasePermission):
    """Permiso exclusivo para administradores."""
    message = "Acceso restringido a administradores del sistema."

    def has_permission(self, request, view):
        return bool(
            request.user
            and getattr(request.user, 'is_authenticated', False)
            and getattr(request.user, 'rol', None) == 'ADMIN'
        )


def require_roles(*allowed_roles):
    """Helper que crea una clase de permiso para validar una lista de roles permitidos."""
    class DynamicRolePermission(BasePermission):
        message = f"Acceso restringido a los siguientes roles: {', '.join(allowed_roles)}"

        def has_permission(self, request, view):
            return bool(
                request.user
                and getattr(request.user, 'is_authenticated', False)
                and getattr(request.user, 'rol', None) in allowed_roles
            )

    return DynamicRolePermission
