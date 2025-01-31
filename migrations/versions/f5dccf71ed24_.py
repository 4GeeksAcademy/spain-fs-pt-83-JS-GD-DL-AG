"""empty message

Revision ID: f5dccf71ed24
Revises: 
Create Date: 2025-01-31 18:28:54.885784

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f5dccf71ed24'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('documents', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image_url', sa.String(length=500), nullable=True))
        batch_op.add_column(sa.Column('uploaded_by', sa.String(length=100), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('documents', schema=None) as batch_op:
        batch_op.drop_column('uploaded_by')
        batch_op.drop_column('image_url')

    # ### end Alembic commands ###
