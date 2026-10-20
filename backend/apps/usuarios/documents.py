from datetime import datetime, timezone
from mongoengine import Document, StringField, EmailField, BooleanField, DateTimeField
from django.contrib.auth.hashers import make_password, check_password


class Usuario(Document):
    """
    Documento de MongoDB para usuarios de la plataforma Colectivos.
    Roles: CONDUCTOR | PASAJERO | ADMIN.
    """
    rut = StringField(required=True, unique=True)
    nombre = StringField(required=True)
    apellido = StringField(required=True)
    email = EmailField(required=True)
    telefono = StringField(default='')
    password = StringField(required=True)
    rol = StringField(required=True, choices=('CONDUCTOR', 'PASAJERO', 'ADMIN'))
    activo = BooleanField(default=True)
    creado_en = DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {
        'collection': 'usuarios',
        'indexes': ['rut', 'email', 'rol'],
        'ordering': ['-creado_en'],
    }

    def set_password(self, raw_password: str):
        """Hashea la contraseña en texto plano."""
        self.password = make_password(raw_password)

    def check_password(self, raw_password: str) -> bool:
        """Verifica la contraseña ingresada contra el hash almacenado."""
        return check_password(raw_password, self.password)

    @property
    def is_authenticated(self) -> bool:
        return True

    @property
    def is_anonymous(self) -> bool:
        return False

    def to_dict(self) -> dict:
        """Serializa el usuario sin exponer el hash de contraseña."""
        return {
            'id': str(self.id),
            'rut': self.rut,
            'nombre': self.nombre,
            'apellido': self.apellido,
            'nombre_completo': f"{self.nombre} {self.apellido}".strip(),
            'email': self.email,
            'telefono': self.telefono,
            'rol': self.rol,
            'activo': self.activo,
            'creado_en': self.creado_en.isoformat() if self.creado_en else None,
        }

    def __str__(self):
        return f"{self.rut} - {self.nombre} {self.apellido} ({self.rol})"


class Sesion(Document):
    """
    Documento de MongoDB para tokens de sesión activos.
    """
    token = StringField(required=True, unique=True)
    usuario_id = StringField(required=True)
    rol = StringField(required=True)
    expira_en = DateTimeField(required=True)
    creado_en = DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {
        'collection': 'sesiones',
        'indexes': ['token', 'usuario_id', 'expira_en'],
        'ordering': ['-creado_en'],
    }

    def is_valid(self) -> bool:
        """Verifica si la sesión sigue vigente."""
        now = datetime.now(timezone.utc)
        if self.expira_en.tzinfo is None:
            # Compatibilidad si mongoengine devuelve datetime naive
            return datetime.utcnow() < self.expira_en
        return now < self.expira_en

    def to_dict(self) -> dict:
        return {
            'token': self.token,
            'usuario_id': self.usuario_id,
            'rol': self.rol,
            'expira_en': self.expira_en.isoformat() if self.expira_en else None,
            'creado_en': self.creado_en.isoformat() if self.creado_en else None,
        }

    def __str__(self):
        return f"Sesion {self.token[:8]}... (Usuario: {self.usuario_id}, Rol: {self.rol})"
