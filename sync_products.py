import re

# 1. Sync Descriptions and Prices from Menu to Dishes
with open('Index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract items from menu
# A menu item box roughly looks like:
# <h3>Name</h3>
# <p>Desc</p>
# <span class="price">Price</span>
menu_pattern = re.compile(r'<h3>(.*?)</h3>\s*<p>\s*(.*?)\s*</p>\s*<span class="price">(.*?)</span>', re.DOTALL)
menu_items = {}
for match in menu_pattern.finditer(html):
    name = match.group(1).strip()
    desc = match.group(2).strip()
    price = match.group(3).strip()
    menu_items[name] = (desc, price)

# Now update the dishes section
# A dish item box roughly looks like:
# <h3>Name</h3>
# <span class="price">Price</span>
# (or might already have a <p> if previously modified)

def replace_dish(match):
    prefix = match.group(1)
    name = match.group(2).strip()
    
    # If this name is in our menu dictionary, use its description and price
    if name in menu_items:
        desc, price = menu_items[name]
        return f'{prefix}<h3>{name}</h3>\n              <p>{desc}</p>\n              <span class="price">{price}</span>'
    return match.group(0)

# The pattern for dishes (we look for h3 followed by anything until price)
# Actually, it's safer to just split into sections or use a specific regex
dishes_start = html.find('id="dishes"')
menu_start = html.find('id="menu"')

if dishes_start != -1 and menu_start != -1:
    dishes_html = html[dishes_start:menu_start]
    other_html_before = html[:dishes_start]
    other_html_after = html[menu_start:]
    
    # Replace in dishes_html
    dish_pattern = re.compile(r'(<div class="content">\s*<div class="stars">.*?</div>\s*)<h3>(.*?)</h3>(?:.*?<span class="price">.*?</span>)', re.DOTALL)
    new_dishes_html = dish_pattern.sub(replace_dish, dishes_html)
    
    html = other_html_before + new_dishes_html + other_html_after

with open('Index.html', 'w', encoding='utf-8') as f:
    f.write(html)


# 2. Update script.js to sync hearts globally
with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

remove_heart_logic = """
          if(existing) {
              wishlist = wishlist.filter(i => i.name !== name);
              showToast('Item removed from wishlist!');
              btn.style.color = '';
"""

new_remove_heart_logic = """
          if(existing) {
              wishlist = wishlist.filter(i => i.name !== name);
              showToast('Item removed from wishlist!');
              document.querySelectorAll('.box, .slide').forEach(b => {
                  let bName = b.querySelector('h3');
                  if (bName && bName.innerText === name) {
                      let bHeart = b.querySelector('.wishlist-btn');
                      if (bHeart) bHeart.style.color = '';
                  }
              });
"""

add_heart_logic = """
          } else {
              wishlist.push({ name, price, img });
              showToast('Item added to wishlist!');
              btn.style.color = 'var(--primary)';
          }
"""

new_add_heart_logic = """
          } else {
              wishlist.push({ name, price, img });
              showToast('Item added to wishlist!');
              document.querySelectorAll('.box, .slide').forEach(b => {
                  let bName = b.querySelector('h3');
                  if (bName && bName.innerText === name) {
                      let bHeart = b.querySelector('.wishlist-btn');
                      if (bHeart) bHeart.style.color = 'var(--primary)';
                  }
              });
          }
"""

# Also update the logic when an item is removed from the wishlist panel
remove_from_panel_logic = """
          if(nameElem && nameElem.innerText === removedItem.name) {
              let btn = box.querySelector('.wishlist-btn');
              if(btn) btn.style.color = '';
          }
"""

new_remove_from_panel_logic = """
          if(nameElem && nameElem.innerText === removedItem.name) {
              let btn = box.querySelector('.wishlist-btn');
              if(btn) btn.style.color = '';
              // Also sync with all identical items
              document.querySelectorAll('.box, .slide').forEach(b => {
                  let bName = b.querySelector('h3');
                  if (bName && bName.innerText === removedItem.name) {
                      let bHeart = b.querySelector('.wishlist-btn');
                      if (bHeart) bHeart.style.color = '';
                  }
              });
          }
"""

# We can replace directly if found
if "btn.style.color = '';" in js and "btn.style.color = 'var(--primary)';" in js:
    js = js.replace(remove_heart_logic.strip(), new_remove_heart_logic.strip())
    js = js.replace(add_heart_logic.strip(), new_add_heart_logic.strip())
    js = js.replace(remove_from_panel_logic.strip(), new_remove_from_panel_logic.strip())

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Updated HTML and JS successfully!")
