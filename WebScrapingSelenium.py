from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time 

driver = webdriver.Chrome()
query = "laptops"
driver.get(f"https://www.amazon.in/s?k={query}&crid=2HPXD4AUQVF0U&sprefix=laptops%2Caps%2C252&ref=nb_sb_noss_2")
elem = driver.find_element(By.CLASS_NAME, "puis-card-container")
print(elem.text)
time.sleep(7)
driver.close()