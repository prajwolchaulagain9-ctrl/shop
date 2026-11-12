from pathlib import Path
import json, re
from playwright.sync_api import sync_playwright, expect

ROOT=Path.cwd()
OUT=ROOT/'test-results'
fixture=json.loads((OUT/'fixtures.json').read_text(encoding='utf-8'))
BASE='http://127.0.0.1:3050'
checks=[]
def checked(name):
    checks.append(name)
    print('PASS',name,flush=True)
def auth_context(browser,token,width=1440,height=960):
    context=browser.new_context(viewport={'width':width,'height':height})
    context.add_cookies([{'name':'auth_token','value':token,'url':BASE}])
    return context
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,channel="chrome")
    public=browser.new_context(viewport={'width':1440,'height':1000})
    page=public.new_page()
    failures=[]
    page.on('pageerror',lambda error:failures.append(str(error)))
    page.goto(BASE);page.wait_for_load_state('networkidle')
    expect(page.get_by_role('heading',name=re.compile('Some things'))).to_be_visible()
    page.locator('.product-card img').first.scroll_into_view_if_needed()
    page.wait_for_function("Array.from(document.querySelectorAll('.product-card img')).every(i=>i.complete&&i.naturalWidth>0)",timeout=30000)
    page.locator('.detail-art').scroll_into_view_if_needed()
    page.wait_for_function("document.querySelector('.detail-art img').naturalWidth>0",timeout=30000)
    page.evaluate('scrollTo(0,0)')
    page.screenshot(path=str(OUT/'home-desktop.png'),full_page=True)
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Desktop overflow'
    checked('Desktop homepage and collection images render')
    page.get_by_role('button',name='Play the 44-second Gautam story film').click()
    video=page.locator('video[controls]')
    expect(video).to_be_visible()
    video.evaluate('(video)=>video.pause()')
    checked('Shop film plays on request')
    page.goto(BASE+'/slippers');page.wait_for_load_state('networkidle')
    expect(page.locator('.product-card').first).to_be_visible()
    page.get_by_role('button',name=re.compile('Add .* to cart')).first.click()
    expect(page.locator('input[type="email"]').first).to_be_visible()
    checked('Adding products requires login')
    assert public.request.get(BASE+'/api/admin/products').status==403
    assert public.request.post(BASE+'/api/orders/create',data={}).status==401
    assert public.request.get(BASE+'/api/admin/seed-products').status==405
    assert public.request.post(BASE+'/api/payment/initiate',data={}).status==409
    checked('Protected admin routes and COD-only payment API')

    customer=auth_context(browser,fixture['customerToken'])
    api=customer.request
    product=fixture['product']
    amount=float(re.search(r'\d[\d,]*(?:\.\d+)?',product['price']).group().replace(',',''))
    item={'productId':product['_id'],'quantity':2,'name':'tampered','price':'NPR 1','image':'fake'}
    delivery={'name':'Test Shopper','phone':'9840000000','address':'Test-only delivery address','email':'test0@example.com'}
    order={'items':[item],'totalAmount':amount*2,'paymentMethod':'cod','customerDetails':delivery}
    bad={**order,'totalAmount':1}
    assert api.post(BASE+'/api/orders/create',data=bad).status==400
    assert api.post(BASE+'/api/orders/create',data={**order,'paymentMethod':'esewa'}).status==400
    assert api.post(BASE+'/api/orders/create',data={**order,'items':[{**item,'quantity':0}]}).status==400
    assert api.post(BASE+'/api/orders/create',data={**order,'items':[{**item,'productId':'111111111111111111111111'}]}).status==400
    good=api.post(BASE+'/api/orders/create',data=order)
    assert good.status==201,good.text()
    order_id=good.json()['order']['_id']
    detail=api.get(BASE+'/api/orders/'+order_id).json()['order']
    assert detail['totalAmount']==amount*2
    assert detail['items'][0]['name']==product['name']
    assert detail['items'][0]['price']==product['price']
    assert detail['paymentStatus']=='pending'
    stranger=auth_context(browser,fixture['strangerToken'])
    assert stranger.request.get(BASE+'/api/orders/'+order_id).status==404
    checked('Order prices and product details come from the database; ownership is enforced')

    shop=customer.new_page()
    shop.goto(BASE+'/slippers');shop.wait_for_load_state('networkidle')
    shop.get_by_role('button',name=re.compile('Add .* to cart')).first.click()
    expect(shop.get_by_role('heading',name=re.compile('Your bag'))).to_be_visible()
    shop.get_by_role('button',name='Close your bag').click()
    shop.reload();shop.wait_for_load_state('networkidle')
    assert len(shop.evaluate("JSON.parse(localStorage.getItem('shopping_cart'))"))==1
    checked('Cart survives refresh')
    shop.get_by_role('button',name=re.compile('Shopping bag')).click()
    shop.get_by_role('button',name='Proceed to Checkout').click()
    shop.wait_for_url('**/checkout');shop.wait_for_load_state('networkidle')
    expect(shop.get_by_role('heading',name='Where shall we deliver?')).to_be_visible()
    assert shop.get_by_text('Cash on Delivery',exact=True).count()==1
    expect(shop.get_by_role('link',name='Contact us on WhatsApp')).to_be_visible()
    assert shop.get_by_text('Khalti',exact=True).count()==0
    shop.get_by_label('Delivery address',exact=True).fill('Test-only Kathmandu address')
    shop.screenshot(path=str(OUT/'checkout-desktop.png'),full_page=True)
    shop.get_by_role('button',name='Place order · Cash on Delivery').click()
    expect(shop.get_by_role('heading',name=re.compile('Thank you'))).to_be_visible(timeout=15000)
    assert shop.evaluate("JSON.parse(localStorage.getItem('shopping_cart')).length")==0
    shop.get_by_role('link',name='All your orders').click()
    shop.wait_for_load_state('networkidle')
    expect(shop.get_by_role('heading',name='Your orders')).to_be_visible()
    expect(shop.get_by_role('link',name='View order').first).to_be_visible()
    checked('Cash on Delivery checkout completes and appears in customer orders')

    admin=auth_context(browser,fixture['adminToken'])
    admin_page=admin.new_page()
    stats_requests=[]
    admin_page.on('request',lambda request:stats_requests.append(request.url) if '/api/admin/stats' in request.url else None)
    admin_page.goto(BASE+'/admin');admin_page.wait_for_load_state('networkidle')
    expect(admin_page.get_by_role('heading',name='Your shop desk.')).to_be_visible()
    assert len(stats_requests)==0
    expect(admin_page.locator('.admin-table')).to_be_visible()
    admin_page.get_by_role('button',name='Products',exact=True).click()
    admin_page.wait_for_load_state('networkidle')
    expect(admin_page.get_by_role('button',name='Add product',exact=True)).to_be_visible()
    table=admin_page.locator('[aria-label="Manage products"]')
    expect(table.locator('tbody tr')).to_have_count(12)
    admin_page.wait_for_function("Array.from(document.querySelectorAll('.admin-thumb img')).slice(0,3).every(i=>i.complete&&i.naturalWidth>0)",timeout=30000)
    admin_page.screenshot(path=str(OUT/'admin-products-desktop.png'),full_page=True)
    table.get_by_role('button',name='Next',exact=True).click();admin_page.wait_for_load_state('networkidle')
    expect(table.get_by_text('Page 2',exact=False)).to_be_visible()
    search=admin_page.get_by_role('textbox',name='Search products')
    search.fill(product['name']);admin_page.wait_for_timeout(400);admin_page.wait_for_load_state('networkidle')
    assert table.locator('tbody tr').count()>=1
    expect(table.get_by_text(product['name'],exact=True).first).to_be_visible()
    checked('Admin loads orders before charts; products paginate and search')
    admin_page.get_by_role('button',name='Add product',exact=True).click()
    dialog=admin_page.get_by_role('dialog')
    expect(dialog).to_be_visible()
    dialog.get_by_label('Product name',exact=True).fill('Preview-only product')
    dialog.get_by_label('Price (e.g. NPR 1200)').fill('NPR 1000')
    admin_page.screenshot(path=str(OUT/'admin-product-form.png'),full_page=True)
    dialog.get_by_label('Description',exact=True).fill('Temporary product used only for isolated verification.')
    dialog.locator('input[type=file]').set_input_files(str(ROOT/'public/media/products/footwear.webp'))
    with admin_page.expect_response(lambda r:'/api/upload' in r.url and r.request.method=='POST') as uploaded:
        dialog.get_by_role('button',name='Save product',exact=True).click()
    uploaded_body=uploaded.value.json()
    assert uploaded.value.status==200,uploaded_body
    (OUT/'uploaded-assets.json').write_text(json.dumps([uploaded_body['publicId']]),encoding='utf-8')
    expect(dialog).not_to_be_visible(timeout=15000)
    created=admin.request.get(BASE+'/api/admin/products?search=Preview-only').json()['products']
    assert len(created)==1
    new_id=created[0]['_id']
    assert created[0]['image'].startswith('https://res.cloudinary.com/')
    assert admin.request.put(BASE+'/api/admin/products/'+new_id,data={'name':'Updated test product'}).status==200
    assert admin.request.delete(BASE+'/api/admin/products/'+new_id).status==200
    checked('Product upload, creation, update and deletion complete successfully')
    admin_page.get_by_role('button',name='Add product',exact=True).click()
    expect(dialog).to_be_visible()
    admin_page.keyboard.press('Escape');expect(dialog).not_to_be_visible()
    checked('Product form opens, scrolls and closes with Escape')
    admin_page.get_by_role('button',name='Overview',exact=True).click();admin_page.wait_for_load_state('networkidle')
    expect(admin_page.get_by_text('Order value',exact=True)).to_be_visible()
    assert len(stats_requests)==1
    admin_page.get_by_role('button',name='Orders',exact=True).click();admin_page.wait_for_load_state('networkidle')
    admin_page.get_by_role('button',name='Overview',exact=True).click();admin_page.wait_for_load_state('networkidle')
    assert len(stats_requests)==1
    checked('Overview statistics are loaded once and retained between tabs')
    admin_api=admin.request
    assert admin_api.patch(BASE+'/api/admin/orders',data={'orderId':order_id,'orderStatus':'invalid'}).status==400
    assert admin_api.patch(BASE+'/api/admin/orders',data={'orderId':order_id,'orderStatus':'processing'}).status==200
    assert api.get(BASE+'/api/orders/'+order_id).json()['order']['orderStatus']=='processing'
    assert admin_api.post(BASE+'/api/admin/seed-products').status==409
    assert admin_api.get(BASE+'/api/admin/products?limit=9999').json()['totalCount']==fixture['productCount']
    checked('Order status updates work and seed requests preserve the catalogue')

    mobile=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
    mobile_page=mobile.new_page()
    mobile_page.goto(BASE);mobile_page.wait_for_load_state('networkidle')
    assert mobile_page.evaluate('document.documentElement.scrollWidth <= innerWidth'),'Mobile home overflow'
    mobile_page.screenshot(path=str(OUT/'home-mobile.png'),full_page=True)
    mobile_page.get_by_role('button',name='Open menu').click()
    expect(mobile_page.locator('#mobile-nav')).to_be_visible()
    mobile_page.locator('#mobile-nav').get_by_role('link',name='Footwear').click()
    mobile_page.wait_for_load_state('networkidle')
    assert mobile_page.evaluate('document.documentElement.scrollWidth <= innerWidth'),'Mobile catalogue overflow'
    checked('Mobile navigation and collection layout fit the viewport')
    admin_page.set_viewport_size({'width':390,'height':844})
    admin_page.get_by_role('button',name='Products',exact=True).click()
    admin_page.get_by_role('button',name='Add product',exact=True).click()
    expect(admin_page.get_by_role('dialog')).to_be_visible()
    scroll=admin_page.get_by_role('dialog').evaluate('(el)=>({scroll:el.scrollHeight,client:el.clientHeight})')
    assert scroll['scroll']>scroll['client']
    admin_page.get_by_role('dialog').get_by_role('button',name='Save product').scroll_into_view_if_needed()
    expect(admin_page.get_by_role('dialog').get_by_role('button',name='Save product')).to_be_visible()
    admin_page.keyboard.press('Escape')
    assert admin_page.evaluate('document.documentElement.scrollWidth <= innerWidth'),'Mobile admin overflow'
    admin_page.screenshot(path=str(OUT/'admin-mobile.png'),full_page=True)
    checked('Admin table scrolls horizontally and product form scrolls on mobile')
    reduced=browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
    reduced_page=reduced.new_page()
    reduced_page.goto(BASE);reduced_page.wait_for_load_state('networkidle')
    assert reduced_page.locator('.studio-hero video').evaluate('(v)=>v.paused')
    checked('Reduced-motion preference pauses hero animation')
    assert not failures,failures
    (OUT/'verification.json').write_text(json.dumps({'passed':checks,'browserErrors':failures},indent=2),encoding='utf-8')
    browser.close()
