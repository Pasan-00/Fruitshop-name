import express from 'express';
import { Fruit } from '../models/vmodels.js';

const router = express.Router();

router.post('/', async (request, response) => {
    try {
        const { foodname, price, image, discount, total, unitType, unitAmount, unitUnit, unitValue, stockUnits } = request.body;

        // Ensure required fields are present
        if (!foodname || price == null || !image) {
            return response.status(400).send({
                message: 'Required fields: foodname, price, image',
            });
        }

        // If front-end sent legacy unitValue (string), try to parse it into amount + unit
        let parsedUnitAmount = unitAmount;
        let parsedUnitUnit = unitUnit;
        if ((parsedUnitAmount == null || !parsedUnitUnit) && unitValue) {
            // simple parse: extract leading number and trailing non-number
            const m = String(unitValue).trim().match(/^([0-9]*\.?[0-9]+)\s*(\w+)?/);
            if (m) {
                parsedUnitAmount = parseFloat(m[1]);
                parsedUnitUnit = m[2] || (unitType === 'pieces' ? 'piece' : 'g');
            }
        }

        // Build document
        const newfruit = {
            foodname,
            price,
            unitType,
            unitAmount: parsedUnitAmount == null ? (unitType === 'pieces' ? 1 : 100) : parsedUnitAmount,
            unitUnit: parsedUnitUnit || (unitType === 'pieces' ? 'piece' : 'g'),
            stockUnits: stockUnits != null ? Number(stockUnits) : 0,
            image,
            discount,
            total,
        };

        // Save the new fruit to the database
        const created = await Fruit.create(newfruit);

        return response.status(201).send(created);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});
  

// Route to get all fruits from the database
router.get('/', async (request, response) => {
    try {
        const fruits = await Fruit.find({});

        return response.status(200).json({
            count: fruits.length,  
            data: fruits            
        });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});


// Rout for Get one fruit from database by ID
router.get('/:id', async (request, response) => {
    try {

        const { id } = request.params;

        const fruit = await Fruit.findById(id);

        return response.status(200).json(fruit );

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });

    }
});


router.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const { foodname, price, image, discount, total, unitType, unitAmount, unitUnit, unitValue, stockUnits } = request.body;

        // If legacy unitValue provided, attempt to parse
        let parsedUnitAmount = unitAmount;
        let parsedUnitUnit = unitUnit;
        if ((parsedUnitAmount == null || !parsedUnitUnit) && unitValue) {
            const m = String(unitValue).trim().match(/^([0-9]*\.?[0-9]+)\s*(\w+)?/);
            if (m) {
                parsedUnitAmount = parseFloat(m[1]);
                parsedUnitUnit = m[2] || (unitType === 'pieces' ? 'piece' : 'g');
            }
        }

        const update = {
            foodname,
            price,
            unitType,
            unitAmount: parsedUnitAmount == null ? (unitType === 'pieces' ? 1 : 100) : parsedUnitAmount,
            unitUnit: parsedUnitUnit || (unitType === 'pieces' ? 'piece' : 'g'),
            stockUnits: stockUnits != null ? Number(stockUnits) : undefined,
            image,
            discount,
            total,
        };

        // If stockUnits wasn't provided, don't overwrite the existing value
        if (stockUnits == null) delete update.stockUnits;

        const result = await Fruit.findByIdAndUpdate(id, update, { new: true });

        if (!result) {
            return response.status(404).json({ message: 'Fruit not found' });
        }

        return response.status(200).send({ message: 'Fruit updated successfully', Fruit: result });
    } catch (error) {
        console.error('Error updating fruit:', error.message);
        response.status(500).send({ message: 'Server error', error: error.message });
    }
});



router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const result = await Fruit.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Food not found' });
        }
        return response.status(200).send({ message: 'Food delete successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Decrement stock units for a fruit by specified qty (number of units)
router.post('/:id/decrement', async (request, response) => {
    try {
        const { id } = request.params;
        const { qty = 1 } = request.body;

        const fruit = await Fruit.findById(id);
        if (!fruit) return response.status(404).json({ message: 'Fruit not found' });

        const dec = Number(qty) || 0;
        if (dec <= 0) return response.status(400).json({ message: 'Invalid qty' });

        // Ensure stockUnits exists
        fruit.stockUnits = fruit.stockUnits || 0;

        if (fruit.stockUnits < dec) {
            return response.status(400).json({ message: 'Insufficient stock', available: fruit.stockUnits });
        }

        fruit.stockUnits = fruit.stockUnits - dec;
        await fruit.save();

        return response.status(200).json({ message: 'Stock decremented', stockUnits: fruit.stockUnits });
    } catch (error) {
        console.error('Error decrementing stock:', error.message);
        response.status(500).send({ message: error.message });
    }
});

// Increment stock units for a fruit by specified qty (number of units)
router.post('/:id/increment', async (request, response) => {
    try {
        const { id } = request.params;
        const { qty = 1 } = request.body;

        const fruit = await Fruit.findById(id);
        if (!fruit) return response.status(404).json({ message: 'Fruit not found' });

        const inc = Number(qty) || 0;
        if (inc <= 0) return response.status(400).json({ message: 'Invalid qty' });

        fruit.stockUnits = (fruit.stockUnits || 0) + inc;
        await fruit.save();

        return response.status(200).json({ message: 'Stock incremented', stockUnits: fruit.stockUnits });
    } catch (error) {
        console.error('Error incrementing stock:', error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;
