from sqlalchemy.orm import Session
from models import Exercise


INITIAL_EXERCISES = [
    "Agachamento frontal halter",
    "Leg horizontal pés paralelos",
    "Elevação pélvica máquina",
    "Cadeira flexora",
    "Cadeira extensora",
    "Cadeira abdutora",
    "Panturrilha máquina",
    "Extensão lombar máquina",
    "Supino máquina",
    "Supino inclinado com halteres",
    "Crucifixo no voador",
    "Desenvolvimento maquina pronada",
    "Elevação lateral",
    "Tríceps na polia alta com corda",
    "Tríceps francês no banco halter",
    "Abdominal remador",
    "Alongamentos on/off",
    "Puxada pela frente pronada",
    "Puxada triangulo",
    "Remada pulley pronada",
    "Bíceps alternado",
    "Bíceps banco scott barra reta",
    "Bíceps martelo halter",
    "Abdominal infra solo joelhos estendidos",
]


def seed_exercises(db: Session) -> None:
    """Popula o banco com exercícios iniciais se estiver vazio."""
    count = db.query(Exercise).count()
    if count > 0:
        return

    for name in INITIAL_EXERCISES:
        exercise = Exercise(
            name=name,
            default_sets=3,
            default_reps=15,
            default_rest=50,
            weight=0.0,
        )
        db.add(exercise)

    db.commit()
    print(f"[OK] Seed concluido: {len(INITIAL_EXERCISES)} exercicios inseridos.")
