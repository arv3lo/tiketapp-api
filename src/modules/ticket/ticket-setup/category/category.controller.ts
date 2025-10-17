import { Router } from "express"
import _ from "lodash"

import { CategoryService } from "@category/category.service"
import { MongooseCategoryRepo } from "@category/adapters/mongodb/category-repo"
import Category from "@category/adapters/mongodb/category.schema"
import { validateCategoryInput } from "@category/ports/category.port"

const router = Router()
const categoryService = new CategoryService(new MongooseCategoryRepo(Category))

// TODO: be careful with these AI generated field recommandations
const inputFields = ['name', 'description', '_id', 'creator']

// in a future improved version, 
// we will add a get categories by it's creator 
// (only users & admins can create a category)

// router.get('/:userID', async (req, res) => {
//     const category = await categoryService.findCategoryBySetupId(req.params.setupID)
//     if (!category) return res.status(404).json({ message: 'Category not found' })

//     res.json(_.pick(category, inputFields))
// })

router.get('/', async (req, res) => {
    const categories = await categoryService.findCategories()
    if (!categories) return res.status(404).json({ message: 'Categories not found' })

    res.json(_.pick(categories, inputFields))
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
