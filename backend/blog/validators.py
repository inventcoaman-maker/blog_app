import re
from django.core.exceptions import ValidationError

class UppercaseSpecialValidator:
    def validate(self, password, user=None):

        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                "Password must contain at least one uppercase letter.",
                code='no_uppercase'
            )

        if not re.search(r'[!@#$%^&*(),.?\":{}|<>]', password):
            raise ValidationError(
                "Password must contain at least one special character.",
                code='no_special'
            )

    def get_help_text(self):
        return "Your password must contain at least one uppercase letter and one special character."
