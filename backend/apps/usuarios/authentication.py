from rest_framework import authentication, exceptions
from apps.usuarios.documents import Sesion, Usuario


class MongoTokenAuthentication(authentication.BaseAuthentication):
    """
    Autenticación por token propio persistido en la colección 'sesiones'.
    Espera la cabecera:
        Authorization: Token <token_hex>
    O bien (soporte flexible):
        Authorization: Bearer <token_hex>
    """
    keyword = 'token'

    def authenticate(self, request):
        auth_header = authentication.get_authorization_header(request).split()

        if not auth_header:
            return None

        header_prefix = auth_header[0].decode('utf-8').lower()
        if header_prefix not in ('token', 'bearer'):
            return None

        if len(auth_header) == 1:
            raise exceptions.AuthenticationFailed('Cabecera de token inválida. Falta el valor del token.')
        elif len(auth_header) > 2:
            raise exceptions.AuthenticationFailed('Cabecera de token inválida. Contiene espacios de más.')

        try:
            token = auth_header[1].decode('utf-8')
        except UnicodeError:
            raise exceptions.AuthenticationFailed('Cabecera de token contiene caracteres inválidos.')

        return self.authenticate_credentials(token)

    def authenticate_credentials(self, token: str):
        sesion = Sesion.objects(token=token).first()
        if not sesion:
            raise exceptions.AuthenticationFailed('Token de autenticación no válido.')

        if not sesion.is_valid():
            raise exceptions.AuthenticationFailed('El token ha expirado. Por favor inicie sesión nuevamente.')

        try:
            usuario = Usuario.objects(id=sesion.usuario_id).first()
        except Exception:
            raise exceptions.AuthenticationFailed('Identificador de usuario inválido en la sesión.')

        if not usuario:
            raise exceptions.AuthenticationFailed('Usuario asociado a la sesión no existe.')

        if not usuario.activo:
            raise exceptions.AuthenticationFailed('La cuenta de usuario está desactivada.')

        return (usuario, sesion.token)

    def authenticate_header(self, request):
        return 'Token'
