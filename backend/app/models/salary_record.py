from tortoise import fields
from tortoise.models import Model


class SalaryRecord(Model):
    id = fields.IntField(pk=True)
    person = fields.ForeignKeyField("models.Person", related_name="salary_records")
    year = fields.IntField()
    month = fields.IntField()  # 1-12

    # Fixed income fields (only base and performance)
    base_salary = fields.DecimalField(max_digits=15, decimal_places=2, default=0)
    performance_salary = fields.DecimalField(max_digits=15, decimal_places=2, default=0)

    # Fixed deduction fields (五险一金 + tax)
    pension_insurance = fields.DecimalField(max_digits=15, decimal_places=2, default=0)
    medical_insurance = fields.DecimalField(max_digits=15, decimal_places=2, default=0)
    unemployment_insurance = fields.DecimalField(max_digits=15, decimal_places=2, default=0)
    critical_illness_insurance = fields.DecimalField(max_digits=15, decimal_places=2, default=0)
    enterprise_annuity = fields.DecimalField(max_digits=15, decimal_places=2, default=0)
    housing_fund = fields.DecimalField(max_digits=15, decimal_places=2, default=0)
    tax = fields.DecimalField(max_digits=15, decimal_places=2, default=0)

    note = fields.CharField(max_length=255, null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "salary_records"
        unique_together = ("person_id", "year", "month")
