from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, Text, create_engine, desc
from sqlalchemy.orm import declarative_base, joinedload, relationship, sessionmaker


DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


class Region(Base):
    __tablename__ = "region"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    comunas = relationship("Comuna", back_populates="region")


class Comuna(Base):
    __tablename__ = "comuna"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey("region.id"), nullable=False)

    region = relationship("Region", back_populates="comunas")
    miembros = relationship("Miembro", back_populates="comuna")


class Miembro(Base):
    __tablename__ = "miembro"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    email = Column(String(80), nullable=False)
    telefono = Column(String(15), nullable=False)
    fecha_registro = Column(DateTime, nullable=False)
    comuna_id = Column(Integer, ForeignKey("comuna.id"), nullable=False)

    comuna = relationship("Comuna", back_populates="miembros")
    actividades = relationship("Actividad", back_populates="miembro", cascade="all, delete")


class Actividad(Base):
    __tablename__ = "actividad"

    id = Column(Integer, primary_key=True, autoincrement=True)
    miembro_id = Column(Integer, ForeignKey("miembro.id"), nullable=False)
    dia = Column(Enum("lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"), nullable=False)
    hora_inicio = Column(String(5), nullable=False)
    duracion = Column(String(5), nullable=False)
    tipo = Column(Enum("arte", "deporte", "tecnología", "social", "recreación", "otra"), nullable=False)
    nombre = Column(String(45), nullable=False)
    descripcion = Column(Text, nullable=True)

    miembro = relationship("Miembro", back_populates="actividades")
    fotos = relationship("Foto", back_populates="actividad", cascade="all, delete")


class Foto(Base):
    __tablename__ = "foto"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    actividad_id = Column(Integer, ForeignKey("actividad.id"), nullable=False)

    actividad = relationship("Actividad", back_populates="fotos")


def get_session():
    return SessionLocal()


def get_regiones():
    session = get_session()
    regiones = session.query(Region).order_by(Region.id).all()
    session.close()
    return regiones


def get_comunas():
    session = get_session()
    comunas = session.query(Comuna).options(joinedload(Comuna.region)).order_by(Comuna.nombre).all()
    session.close()
    return comunas


def get_comuna_by_id(comuna_id):
    session = get_session()
    comuna = session.query(Comuna).filter_by(id=comuna_id).first()
    session.close()
    return comuna


def get_last_members(limit=5):
    session = get_session()
    members = (
        session.query(Miembro)
        .options(joinedload(Miembro.comuna).joinedload(Comuna.region))
        .order_by(desc(Miembro.fecha_registro), desc(Miembro.id))
        .limit(limit)
        .all()
    )
    session.close()
    return members


def count_members():
    session = get_session()
    total = session.query(Miembro).count()
    session.close()
    return total


def get_members_page(page=1, page_size=5):
    session = get_session()
    members = (
        session.query(Miembro)
        .options(joinedload(Miembro.comuna).joinedload(Comuna.region))
        .order_by(Miembro.nombre)
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    session.close()
    return members


def get_member_detail(member_id):
    session = get_session()
    member = (
        session.query(Miembro)
        .options(
            joinedload(Miembro.comuna).joinedload(Comuna.region),
            joinedload(Miembro.actividades).joinedload(Actividad.fotos),
        )
        .filter_by(id=member_id)
        .first()
    )
    session.close()
    return member


def create_member_with_activities(member_data, activities_data):
    session = get_session()
    try:
        member = Miembro(
            nombre=member_data["nombre"],
            email=member_data["email"],
            telefono=member_data["telefono"],
            comuna_id=member_data["comuna_id"],
            fecha_registro=datetime.now(),
        )
        session.add(member)
        session.flush()

        for activity_data in activities_data:
            activity = Actividad(
                miembro_id=member.id,
                dia=activity_data["dia"],
                hora_inicio=activity_data["hora_inicio"],
                duracion=activity_data["duracion"],
                tipo=activity_data["tipo"],
                nombre=activity_data["nombre"],
                descripcion=activity_data.get("descripcion") or None,
            )
            session.add(activity)
            session.flush()

            for photo_data in activity_data["fotos"]:
                session.add(
                    Foto(
                        ruta_archivo=photo_data["ruta_archivo"],
                        nombre_archivo=photo_data["nombre_archivo"],
                        actividad_id=activity.id,
                    )
                )

        session.commit()
        return True, member.id
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
