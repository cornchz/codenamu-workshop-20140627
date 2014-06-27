#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import json

years = None
result = {}

with open('unemployment_rate.csv', encoding='cp949') as f:
    reader = csv.DictReader(f, delimiter=',')
    for row in reader:
        name = row.pop('시도별')
        del row['연령계층별']
        rates = { int(key): float(val) for key, val in row.items() }
        if years is None:
            years = list(sorted(map(int, row.keys())))
        result[name] = rates

with open('unemployment_rate.json', 'w') as f:
    json.dump({
        'years': years,
        'items': result
    }, f, indent=2)

