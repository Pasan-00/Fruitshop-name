import express from 'express';
import { Fruit } from '../models/vmodels.js';

const router = express.Router();

router.post('/', async (request, response) => {
    try {
      const { foodname, quantity, price, image ,discount ,total} = request.body;
  
      // Ensure all required fields are present
      if (!foodname || !quantity || !price || !image) {
        return response.status(400).send({
          message: 'Send all required fields: foodname, quantity, price, image',
        });
      }
  
      // Create a new fruits with the provided data
      const newfruit = {
        foodname,
        quantity,
        price,
        image,
        discount,
        total,
      };
  
      // Save the new vegetable to the database
      const Fruit = await Fruit.create(newfruit);
  
      return response.status(201).send(Fruit);
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
        const { foodname, quantity, price, image, discount, total } = request.body; 

        const result = await Fruit.findByIdAndUpdate(id, {
            foodname,
            quantity,
            price,
            image,       
            discount,    
            total        
        }, { new: true });

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

export default router;
