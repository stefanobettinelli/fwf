"""empty message

Revision ID: a7b32ae2fdca
Revises: 
Create Date: 2020-08-24 23:28:46.072878

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "a7b32ae2fdca"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "countries",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("capital", sa.String(), nullable=False),
        sa.Column("region", sa.String(), nullable=False),
        sa.Column("flag", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("countries")
    # ### end Alembic commands ###
