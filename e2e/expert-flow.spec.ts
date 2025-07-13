import { test, expect } from '@playwright/test'

test.describe('Expert to Herb to Graph Flow', () => {
  test('should navigate from expert list to expert detail to herb detail', async ({ page }) => {
    // Go to home page (expert list)
    await page.goto('/')

    // Wait for expert cards to load
    await page.waitForSelector('[data-testid="expert-card"]', { 
      state: 'visible',
      timeout: 10000 
    })

    // Click on the first expert card
    const firstExpertCard = page.locator('[data-testid="expert-card"]').first()
    const expertName = await firstExpertCard.locator('h3').textContent()
    await firstExpertCard.click()

    // Verify we're on the expert detail page
    await expect(page).toHaveURL(/\/experts\//)
    await expect(page.locator('h1')).toContainText(expertName!)

    // Wait for recommended herbs section
    await page.waitForSelector('[data-testid="herb-card"]', { 
      state: 'visible',
      timeout: 10000 
    })

    // Click on the first recommended herb
    const firstHerbCard = page.locator('[data-testid="herb-card"]').first()
    const herbName = await firstHerbCard.locator('[data-testid="herb-name"]').textContent()
    await firstHerbCard.click()

    // Verify we're on the herb detail page
    await expect(page).toHaveURL(/\/herbs\//)
    await expect(page.locator('h1')).toContainText(herbName!)
  })

  test('should navigate to graph view from expert detail', async ({ page }) => {
    // Go to home page
    await page.goto('/')

    // Navigate to first expert
    await page.waitForSelector('[data-testid="expert-card"]')
    await page.locator('[data-testid="expert-card"]').first().click()

    // Click on graph view button
    await page.locator('[data-testid="view-graph-button"]').click()

    // Verify we're on the graph page
    await expect(page).toHaveURL(/\/graph/)
    
    // Wait for graph canvas to be visible
    await page.waitForSelector('canvas', { state: 'visible', timeout: 10000 })
  })

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/')

    // Test navigation to herbs page
    await page.locator('nav a:has-text("药材图鉴")').click()
    await expect(page).toHaveURL('/herbs')

    // Test navigation back to home (experts)
    await page.locator('nav a:has-text("中医大师")').click()
    await expect(page).toHaveURL('/')

    // Test navigation to graph
    await page.locator('nav a:has-text("知识图谱")').click()
    await expect(page).toHaveURL('/graph')
  })

  test('should search and filter experts', async ({ page }) => {
    await page.goto('/')

    // Wait for initial load
    await page.waitForSelector('[data-testid="expert-card"]')

    // Type in search box
    const searchInput = page.locator('input[placeholder*="搜索专家"]')
    await searchInput.fill('张')
    
    // Wait for filtered results
    await page.waitForTimeout(500) // Debounce delay

    // Verify results are filtered
    const expertCards = page.locator('[data-testid="expert-card"]')
    const count = await expertCards.count()
    
    // At least one result should contain the search term
    const firstCardText = await expertCards.first().textContent()
    expect(firstCardText).toContain('张')
  })
})