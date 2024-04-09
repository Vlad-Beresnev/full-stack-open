const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http:localhost:3000/api/testing/reset')
        await request.post('http://localhost:3000/api/users', {
            data: {
                name: 'root',
                username: 'root',
                password: 'salainen'
            }
        })

        page.pause()

        await request.post('http://localhost:3000/api/users', {
            data: {
                name: 'root2',
                username: 'root2',
                password: 'salainen2'
            }
        })



        await page.goto('http://localhost:5173/')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByText('Log in to application')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'root', 'salainen')
            await expect(page.getByText('root logged in')).toBeVisible()

            // await page.getByTestId('username').fill('root')
            // await page.getByTestId('password').fill('salainen')

            // await page.getByRole('button', { name: 'login'}).click()

            // await expect(page.getByText('root logged-in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'root', 'wrong')
            await expect(page.getByText('wrong credentials')).toBeVisible()
        })
})

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'root', 'salainen')
        })

        test('A blog can be created', async ({ page }) => {
            await createBlog(page, {
                title: 'test title 888',
                author: 'test author 888',
                url: 'test url 888',
            })

            await expect(page.getByText('test title 888')).toBeVisible()
        })

        test('A blog can be liked', async ({ page }) => {
            await createBlog(page, {
                title: 'test title 888',
                author: 'test author 888',
                url: 'test url 888',
            })

            await page.getByRole('button', { name: 'view'}).click()
            await page.getByRole('button', { name: 'like'}).click()
            await expect(page.getByText('likes 1')).toBeVisible()
        })

        test('A blog can be removed', async ({ page }) => {
            await createBlog(page, {
                title: 'test delete 888',
                author: 'test author 888',
                url: 'test url 888',
            })
            //Correct user can see the remove button
            await page.locator('#remove-none-btn').evaluate(e => e.style.display ='inline')            
            await page.getByRole('button', { name: 'view'}).click()
            page.on('dialog', dialog => dialog.accept())
            await page.getByRole('button', { name: 'remove' }).click()  
            await expect(page.getByText('test delete 888')).not.toBeVisible()
        })
    
        test('Remove button is not shown for blogs created by other users', async({ page }) => {
            await createBlog(page, {
                title: 'test delete 888',
                author: 'test author 888',
                url: 'test url 888',
            })

            await page.getByRole('button', { name: 'logout'}).click()

            await loginWith(page, 'root2', 'salainen2')

            await page.getByRole('button', { name: 'view'}).click()
            await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
            await page.reload()
        })

        test('Blogs are ordered by likes', async ({ page }) => {
            const blogs = [
                {
                  title: 'test title 111',
                  author: 'test author 111',
                  url: 'test url 111',
                  likes: 1
                },
                {
                  title: 'test title 222',
                  author: 'test author 222',
                  url: 'test url 222',
                  likes: 2
                },
                {
                  title: 'test title 333',
                  author: 'test author 333',
                  url: 'test url 333',
                  likes: 3
                }
              ];
            
              for (const blog of blogs) {
                await createBlog(page, blog);
                await page.pause(2000)
                await page.reload()
              }

            await page.reload()

            const firstBlog = page.locator('.blog').first()

            await expect(firstBlog).toContainText('test title 333')
        })
    })
})
