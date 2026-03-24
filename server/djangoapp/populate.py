from .models import CarMake, CarModel


def initiate():
    if CarMake.objects.exists() or CarModel.objects.exists():
        return

    car_make_data = [
        {"name": "NISSAN", "description": "Great cars. Japanese technology"},
        {"name": "Mercedes", "description": "Great cars. German technology"},
        {"name": "Audi", "description": "Great cars. German technology"},
        {"name": "Kia", "description": "Great cars. Korean technology"},
        {"name": "Toyota", "description": "Great cars. Japanese technology"},
    ]

    make_map = {}
    for data in car_make_data:
        make = CarMake.objects.create(
            name=data['name'], description=data['description'])
        make_map[data['name']] = make

    car_model_data = [
        {"name": "Pathfinder", "type": "SUV", "year": 2023,
            "dealer_id": 15, "make": "NISSAN"},
        {"name": "Qashqai", "type": "SUV", "year": 2023,
            "dealer_id": 15, "make": "NISSAN"},
        {"name": "XTRAIL", "type": "SUV", "year": 2023,
            "dealer_id": 15, "make": "NISSAN"},
        {"name": "A-Class", "type": "SUV", "year": 2023,
            "dealer_id": 3, "make": "Mercedes"},
        {"name": "C-Class", "type": "SUV", "year": 2023,
            "dealer_id": 3, "make": "Mercedes"},
        {"name": "E-Class", "type": "SUV", "year": 2023,
            "dealer_id": 3, "make": "Mercedes"},
        {"name": "A4", "type": "SUV", "year": 2023, "dealer_id": 8, "make": "Audi"},
        {"name": "A5", "type": "SUV", "year": 2023, "dealer_id": 8, "make": "Audi"},
        {"name": "A6", "type": "SUV", "year": 2023, "dealer_id": 8, "make": "Audi"},
        {"name": "Sorrento", "type": "SUV", "year": 2023,
            "dealer_id": 34, "make": "Kia"},
        {"name": "Carnival", "type": "SUV", "year": 2023,
            "dealer_id": 34, "make": "Kia"},
        {"name": "Cerato", "type": "Sedan", "year": 2023,
            "dealer_id": 34, "make": "Kia"},
        {"name": "Corolla", "type": "Sedan", "year": 2023,
            "dealer_id": 41, "make": "Toyota"},
        {"name": "Camry", "type": "Sedan", "year": 2023,
            "dealer_id": 41, "make": "Toyota"},
        {"name": "Kluger", "type": "SUV", "year": 2023,
            "dealer_id": 41, "make": "Toyota"},
    ]

    for data in car_model_data:
        CarModel.objects.create(
            name=data['name'],
            car_make=make_map[data['make']],
            type=data['type'],
            year=data['year'],
            dealer_id=data['dealer_id'],
        )
