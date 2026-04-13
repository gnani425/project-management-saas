import os

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")  # from Stripe dashboard
STRIPE_WEBHOOK_SECRET = "whsec_1d9a786c446b104de17aa0c40d297b98fb7f36c42a7e1e484be8cbe8c079a2e1"
STRIPE_PRICE_ID = "price_1TJw2cGSYqtC8SF2UQjOVU2X"    # subscription price ID