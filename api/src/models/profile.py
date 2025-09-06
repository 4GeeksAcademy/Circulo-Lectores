from sqlalchemy import String, VARCHAR, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import db
from src.models.user import Users
from src.models.recommendations import Recommendations
from src.models.readinglist import ReadingList


class Profiles(db.Model):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    avatar: Mapped[str] = mapped_column(String(150), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["Users"] = relationship(back_populates="profile")
    recommendation: Mapped["Recommendations"] = relationship(back_populates="profile")
    readinglist: Mapped["ReadingList"] = relationship(back_populates="profile")

    def __repr__(self):
        return f"<User {self.user_name}>"

    def serialize(self):
        return {
            "id": self.id,
            "user_name": self.user_name,
            "email": self.email,
        }
