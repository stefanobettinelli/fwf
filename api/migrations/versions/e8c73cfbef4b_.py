"""empty message

Revision ID: e8c73cfbef4b
Revises: ff1123ae20b6
Create Date: 2020-08-31 20:43:27.162124

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "e8c73cfbef4b"
down_revision = "ff1123ae20b6"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("questions", sa.Column("game_id", sa.Integer(), nullable=True))
    op.create_foreign_key(None, "questions", "games", ["game_id"], ["id"])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "questions", type_="foreignkey")
    op.drop_column("questions", "game_id")
    # ### end Alembic commands ###
