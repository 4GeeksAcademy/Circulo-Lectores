from sqlalchemy import String, VARCHAR
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import db
from src.models.profile import Profiles


class Users(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    email: Mapped[str] = mapped_column(String(50), nullable=False)
    password: Mapped[str] = mapped_column(VARCHAR(60), nullable=False)
    profile: Mapped["Profiles"] = relationship(back_populates="user")

    def __repr__(self):
        return f"<User {self.email}>"

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
        }
