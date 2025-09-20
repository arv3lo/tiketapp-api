import { Router } from "express"
import _ from "lodash"

import { CategoryService } from "@category/category.service"
import { MongooseCategoryRepo } from "@category/adapters/mongoose.category-repo"
import Category, { validateCategoryInput } from "@category/ports/category.schema"

const router = Router()
const categoryService = new CategoryService(new MongooseCategoryRepo(Category))

// TODO: be careful with these AI generated field recommandations
const inputFields = ['name', 'description', '_id']

router.get('/:setupID', async (req, res) => {
    const category = await categoryService.findCategoryBySetupId(req.params.setupID)
    if (!category) return res.status(404).json({ message: 'Category not found' })

    res.json(_.pick(category, inputFields))
})

router.post('/', async (req, res) => {
    const category = await categoryService.createCategory(validateCategoryInput(req.body))
    if (!category) return res.status(404).json({ message: 'Category not created' })

    res.json(_.pick(category, inputFields))
})

router.delete('/:id', async (req, res) => {
    const category = await categoryService.deleteCategory(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category not deleted' })

    res.json(_.pick(category, inputFields))
})

export default router
