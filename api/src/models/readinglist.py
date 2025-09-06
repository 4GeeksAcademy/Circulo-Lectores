from sqlalchemy import String, VARCHAR, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import db
from src.models.profile import Profiles
from typing import List


class ReadingList(db.Model):
    __tablename__ = "readinglist"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    book_id: Mapped[str] = mapped_column(String(50), nullable=False)
    profile_id: Mapped[int] = mapped_column(ForeignKey("profiles.id"))
    profile: Mapped[List["Profiles"]] = relationship(back_populates="readinglist")

    def __repr__(self):
        return f"<Profile {self.profile_id}>"

    def serialize(self):
        return {
            "id": self.id,
            "book_id": self.book_id,
            "profile_id": self.profile_id,
        }
