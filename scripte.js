// Get references to important DOM elements
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCartButton = document.getElementById("clearCartButton");
const placeOrderButton = document.getElementById("PlaceOrdertButton");
const saveCustomerDetailsButton = document.getElementById("saveCustomerDetails");
const searchButton = document.getElementById("searchButton");
const DeleteButton = document.getElementById("DeleteButton");

let cart = []; // Array to store cart items

// Function to update the cart display
function updateCartDisplay() {
    cartItems.innerHTML = ""; // Clear the current cart display
    let totalAmount = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `
      <tr>
        <td colspan="6" style="padding: 10px; border: 1px solid #ccc; text-align: center;">No items in the cart</td>
      </tr>
    `;
    } else {
        cart.forEach((item, index) => {
            totalAmount += item.totalPrice;
            cartItems.innerHTML += `
        <tr>
          <td style="padding: 1px; border: 1px solid #ccc;">${item.name}</td>
          <td style="padding: 10px; border: 1px solid #ccc;">
           <div style="display: flex; align-items: center; justify-content: center; gap:1 px auto; 
    padding: 1px; border-radius: 5px;">
    
    <button onclick="changeQuantity(${index}, -1)" 
        style="flex: 1; max-width: 40px; background-color: red; border-radius: 5px; color: white; font-size: 16px auto; border: none; cursor: pointer; padding: 5px; height: 30px;">
        -
    </button>
    
    <span style="min-width: 40px; text-align: center; font-size: 18px auto;">${item.quantity}</span>

    <button onclick="changeQuantity(${index}, 1)" 
        style="flex: 1; max-width: 40px; background-color: green; border-radius: 5px; color: white; font-size: 16px auto; border: none; cursor: pointer; padding: 5px; height: 30px;">
        +
    </button>
</div>
     </td>
          <td style="padding: 10px; border: 1px solid #ccc;">₹${item.unitPrice}</td>
          <td style="padding: 10px; border: 1px solid #ccc;">₹${item.totalPrice}</td>
          <td style="padding: 10px; border: 1px solid #ccc;">
            <button onclick="deleteProduct(${index})" style="border: 1px solid #ccc; background-color: red; color: white; border: none; cursor: pointer;border-radius: 5px; font-size: 20px auto;  height: 30px;  text-align: center; padding:1px;">
              Delete
            </button>
          </td>
        </tr>
      `;
        });
    }

    cartTotal.textContent = totalAmount.toFixed(2);
}

// Function to delete product from the cart
function deleteProduct(index) {
    if (confirm("Are you sure you want to delete this product? / तुम्हाला खात्री आहे की तुम्ही हे उत्पादन हटवू इच्छिता?")) {
        cart.splice(index, 1); // Remove item from array
        updateCartDisplay(); // Refresh cart display
    }
}

// Function to increase or decrease quantity
function changeQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity < 1) {
            cart[index].quantity = 1; // Ensure minimum quantity is 1
        }
        cart[index].totalPrice = cart[index].quantity * cart[index].unitPrice;
        updateCartDisplay();
    }
}


// Function to add product to the cart
document.querySelectorAll(".addCartButton").forEach((button) => {
    button.addEventListener("click", (event) => {
        const productElement = event.target.closest(".product");
        const productName = productElement.dataset.name;
        const productPrice = parseFloat(productElement.dataset.price);
        const quantityInput = productElement.querySelector("input[type='number']");
        const quantity = parseInt(quantityInput.value);

        if (quantity > 0) {
            const existingItem = cart.find((item) => item.name === productName);

            if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
            } else {
                cart.push({
                    name: productName,
                    quantity: quantity,
                    unitPrice: productPrice,
                    totalPrice: quantity * productPrice,
                });
            }

            quantityInput.value = ""; // Clear input field
            updateCartDisplay();
        } else {
            alert("Please enter a valid quantity!");
        }
    });
});

// Function to clear the cart
clearCartButton.addEventListener("click", () => {
    cart = [];
    updateCartDisplay();
});

// Function to place an order
placeOrderButton.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items to the cart before placing an order.");
        return;
    }

    const customerName = document.getElementById("customerName").value.trim();
    const customerAddress = document.getElementById("customerAddress").value.trim();
    const customerNumber = document.getElementById("customerNumber").value.trim();
    const referenceCode = document.getElementById("referenceCode").value.trim();

    if (!customerName || !customerAddress || !customerNumber || !referenceCode) {
        alert("Please fill your details before placing an order. / ऑर्डर देण्यापूर्वी कृपया तुमचे तपशील भरा.");
        return;
    }

    let orderDetails = `Order Details:\nName: ${customerName}\nAddress: ${customerAddress}\nCode: ${referenceCode}\nMobile: ${customerNumber}\n`;
    orderDetails += `\nProducts:\n`;


    cart.forEach((item) => {
        orderDetails += `${item.name} - ${item.quantity}kg @ ₹${item.unitPrice}/kg = ₹${item.totalPrice}\n`;
    });

    orderDetails += `\nTotal Amount: ₹${cartTotal.textContent}`;

    // Encode the message for WhatsApp URL
    const whatsappMessage = encodeURIComponent(orderDetails);
    const whatsappLink = `https://wa.me/+918208195103?text=${whatsappMessage}`;

    // Open the WhatsApp link
    window.open(whatsappLink, "_blank");

    // Clear the cart
    cart = [];
    updateCartDisplay();
});

// Function to save customer details
saveCustomerDetailsButton.addEventListener("click", () => {
    const customerName = document.getElementById("customerName").value.trim();
    const customerAddress = document.getElementById("customerAddress").value.trim();
    const customerNumber = document.getElementById("customerNumber").value.trim();
    const referenceCode = document.getElementById("referenceCode").value.trim();

    if (!customerName || !customerAddress || !customerNumber || !referenceCode) {
        alert("Please fill in all fields. / कृपया सर्व फील्ड भरा.");
        return;
    }

    alert("Customer details saved successfully! / ग्राहक तपशील यशस्वीरित्या जतन केले!");
});

const searchBar = document.getElementById("searchBar");
const products = document.querySelectorAll(".product");

searchBar.addEventListener("input", () => {
    const searchQuery = searchBar.value.toLowerCase();

    products.forEach((product) => {
        const productName = product.dataset.name.toLowerCase();

        if (searchQuery === "" || productName.includes(searchQuery)) {
            product.style.display = "block"; // Show matching or all products
        } else {
            product.style.display = "none"; // Hide non-matching products
        }
    });
});


/* JS for Products Details */
document.addEventListener("DOMContentLoaded", function () {
    const modalTriggers = document.querySelectorAll(".open-modal");

    const productDetails = {
        "Amino Acids 80% Powder": {
            "General Details": "Amino Acids 80% Powder is a concentrated bio-stimulant derived from hydrolyzed proteins. It enhances plant growth, improves stress resistance, and boosts nutrient absorption.",
            "Composition": {
                "Total Amino Acids": "80% (w/w), derived from hydrolyzed protein",
                "Appearance": "Light yellow to brown powder, soluble in water",
                "Amino Acid Types": [
                    "Glycine", "Alanine", "Glutamic acid", "Aspartic acid", "Lysine", "Proline", "Other amino acids depending on the source"
                ]
            },
            "Agricultural Uses": [
                "Enhances plant metabolism and chlorophyll synthesis",
                "Improves nutrient absorption and photosynthesis efficiency",
                "Increases resistance to drought, salinity, and temperature stress",
                "Reduces crop shock from pesticides and herbicides",
                "Chelates micronutrients (e.g., zinc, iron, calcium) for better bioavailability"
            ],
            "Application": [
                "Soil Application: Apply 2–5 kg per acre by mixing with organic manure or soil. Broadcast or apply directly to the root zone before irrigation to enhance nutrient absorption and plant metabolism.",
                "Foliar Spray: Dissolve 1–2 grams per liter of water (250–500 grams per acre) and spray on plant leaves to improve protein synthesis, enzyme activation, and stress resistance. Apply early morning or late afternoon to avoid leaf burn.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 500 grams – 1 kg per acre in 100–200 liters of water and applying in multiple splits to support plant growth and development.",
                "Drenching: Dissolve 500 grams – 1 kg per acre in 200 liters of water and apply directly to the root zone to enhance root development and microbial activity."
            ],
            "Advantages": [
                "Boosts plant growth and yield",
                "Enhances soil microbial activity",
                "Improves the quality of fruits, vegetables, and other crops",
                "Compatible with most fertilizers and pesticides",
                "Supports environmentally friendly and sustainable agriculture"
            ]
        }
        ,
        "Potassium Fulvic Acids 80% Powder":
        {
            "General Details": "Potassium Fulvic Acids 80% Powder is a highly concentrated organic material derived from natural plant or mineral sources. It enhances soil quality, improves nutrient uptake, and promotes healthy plant growth.",
            "Composition": {
                "Fulvic Acid": "80%",
                "Potassium (K2O)": "Essential potassium in bioavailable form",
                "Trace Minerals and Micro-nutrients": "Naturally present in fulvic acid"
            },
            "Agricultural Uses": [
                "Enhances soil structure and microbial activity",
                "Boosts availability of essential nutrients",
                "Promotes plant growth and root development",
                "Helps plants withstand environmental stress"
            ],
            "Application": [
                "Soil Application: Apply 2–5 kg per acre by mixing with organic manure or soil. Broadcast or apply directly to the root zone before irrigation to enhance soil fertility, water retention, and nutrient absorption.",
                "Foliar Spray: Dissolve 1–2 grams per liter of water (250–500 grams per acre) and spray on plant leaves to improve photosynthesis, stress resistance, and overall plant health. Apply early morning or late afternoon to avoid leaf burn.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 500 grams – 1 kg per acre in 100–200 liters of water and applying in multiple splits to boost root and shoot growth.",
                "Drenching: Dissolve 500 grams – 1 kg per acre in 200 liters of water and apply directly to the root zone to stimulate microbial activity and increase nutrient availability."
            ],
            "Advantages": [
                "Increases nutrient efficiency, reducing fertilizer waste",
                "Improves soil aeration and water retention",
                "Enhances crop yield",
                "Environmentally friendly and organic farming compatible"
            ]
        }
        ,

        "Chelated Micro nutrients EDTA Powder":
        {
            "General Details": "Chelated Mix Micronutrients EDTA Powder is a high-quality, water-soluble fertilizer that supplies essential micronutrients in a bioavailable form. The chelation process ensures stability and easy absorption, even in alkaline or challenging soil conditions, making it ideal for modern agriculture.",
            "Composition": {
                "Iron (Fe)": "5-10% (EDTA-chelated)",
                "Zinc (Zn)": "4-6% (EDTA-chelated)",
                "Copper (Cu)": "1-2% (EDTA-chelated)",
                "Manganese (Mn)": "3-5% (EDTA-chelated)",
                "Boron (B)": "0.5-1%",
                "Molybdenum (Mo)": "0.1-0.2%"
            },
            "Agricultural Uses": [
                "Supplies essential micronutrients that support plant metabolic processes such as photosynthesis, respiration, and enzyme activation",
                "Prevents and corrects deficiencies like iron chlorosis and zinc deficiency",
                "Enhances plant growth, flowering, and fruit development",
                "Improves crop yield and quality",
                "Suitable for soils with poor nutrient availability due to high pH or salinity"
            ],
            "Application": [
                "Soil Application: Apply 1–2 kg per acre by mixing with 50–100 kg of organic manure or soil. Broadcast or apply directly to the root zone before irrigation to improve micronutrient availability and prevent deficiencies.",
                "Foliar Spray: Dissolve 0.5–1 gram per liter of water (250–500 grams per acre) and spray on plant leaves for rapid nutrient absorption, improving chlorophyll production, enzyme activation, and overall plant growth. Apply early morning or late afternoon to avoid leaf burn.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 500 grams – 1 kg per acre in 100–200 liters of water and applying in multiple splits to ensure efficient uptake of micronutrients like Zn, Fe, Mn, Cu, etc.",
                "Drenching: Dissolve 500 grams – 1 kg per acre in 200 liters of water and apply directly to the root zone to enhance root development, nutrient transportation, and microbial activity."
            ],
            "Advantages": [
                "Provides a balanced mix of essential micronutrients in a chelated form for better absorption",
                "Highly soluble and efficient in all soil types and growing conditions",
                "Compatible with most fertilizers and agricultural chemicals",
                "Enhances crop resistance to stress and improves overall yield",
                "Prevents nutrient precipitation in soil, ensuring long-term availability"
            ]
        }
        ,
        "Micro nutrients EDTA Powder":
        {
            "General Details": "Micronutrients EDTA Powder is a water-soluble chelated fertilizer that provides essential trace elements in an easily absorbable form. The EDTA chelation ensures stability and availability, even in high-pH or saline soils, making it effective in preventing and treating micronutrient deficiencies in crops.",
            "Composition": {
                "Iron (Fe)": "10-15% (EDTA-chelated)",
                "Zinc (Zn)": "5-10% (EDTA-chelated)",
                "Copper (Cu)": "2-5% (EDTA-chelated)",
                "Manganese (Mn)": "3-7% (EDTA-chelated)",
                "Boron (B)": "0.5-2%",
                "Molybdenum (Mo)": "0.1-0.5%"
            },
            "Agricultural Uses": [
                "Provides essential micronutrients required for plant growth, photosynthesis, and enzyme functions",
                "Corrects deficiencies such as iron chlorosis and zinc deficiency, preventing stunted growth",
                "Enhances plant health, flowering, and fruit/seed production",
                "Improves resistance to environmental stresses like drought, heat, and salinity"
            ],
            "Application": [
                "Soil Application: Apply 1–2 kg per acre by mixing with 50–100 kg of organic manure or soil. Broadcast or apply directly to the root zone before irrigation for better nutrient availability.",
                "Foliar Spray: Dissolve 0.5–1 gram per liter of water (250–500 grams per acre) and spray on plant leaves to enhance plant growth, enzyme activity, and nutrient absorption. Apply early morning or late afternoon to avoid leaf burn.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 500 grams – 1 kg per acre in 100–200 liters of water and applying in multiple splits for balanced micronutrient supply.",
                "Drenching: Dissolve 500 grams – 1 kg per acre in 200 liters of water and apply directly to the root zone to improve root and shoot growth and prevent micronutrient deficiencies."
            ],
            "Advantages": [
                "EDTA chelation ensures high stability and bioavailability of nutrients",
                "Effective in a wide range of soil types, including alkaline and saline conditions",
                "Prevents nutrient-related disorders and promotes balanced plant growth",
                "Fully water-soluble, easy to handle, and apply",
                "Compatible with most fertilizers and pesticides",
                "Environmentally safe and suitable for sustainable agriculture"
            ]
        }
        ,
        "Ferrous Chelated 12% EDTA Powder":
        {
            "General Details": "Ferrous Chelated 12% EDTA Powder is a highly effective, water-soluble iron source for agricultural use. The EDTA chelation process ensures that iron remains stable and bioavailable, even in alkaline or calcareous soils, preventing and treating iron chlorosis in crops.",
            "Composition": {
                "Iron (Fe)": "12% (EDTA-chelated)"
            },
            "Agricultural Uses": [
                "Provides a readily available source of iron, essential for chlorophyll synthesis and photosynthesis",
                "Effectively treats iron deficiency (iron chlorosis) that causes yellowing of leaves and poor growth",
                "Enhances plant vigor, leaf greening, and overall yield",
                "Suitable for soil and foliar application in various crops, including fruits, vegetables, cereals, and ornamentals"
            ],
            "Application": [
                "Soil Application: Mix 1–2 kg per acre with 50–100 kg of organic manure or soil and broadcast or apply directly to the root zone before irrigation.",
                "Foliar Spray: Dissolve 0.5–1 gram per liter of water and spray onto plant leaves for rapid nutrient uptake. Apply in the early morning or late afternoon to avoid leaf burn.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 500 grams – 1 kg per acre in 100–200 liters of water and applying through the irrigation system in multiple splits.",
                "Drenching: Dissolve 500 grams – 1 kg per acre in 200 liters of water and apply directly to the root zone for better absorption."
            ],
            "Advantages": [
                "High bioavailability: EDTA chelation keeps iron stable and easily absorbable by plants",
                "Effective in a wide range of soil types, including high-pH and saline soils",
                "Rapidly alleviates symptoms of iron deficiency, promoting healthy plant growth",
                "Fully water-soluble for easy application through multiple methods",
                "Environmentally friendly: Reduces iron runoff and leaching, minimizing environmental impact",
                "Supports robust plant growth, improved chlorophyll production, and higher crop yields"
            ]
        }
        ,
        "Zinc Chelated 12% EDTA Powder":
        {
            "General Details": "Zinc Chelated 12% EDTA Powder is a high-quality, water-soluble micronutrient fertilizer that provides plants with readily available zinc. The EDTA chelation process ensures zinc remains stable and bioavailable, even in alkaline or saline soils, supporting essential plant enzymatic processes, growth regulation, and chlorophyll production.",
            "Composition": {
                "Zinc (Zn)": "12% (EDTA-chelated)"
            },
            "Agricultural Uses": [
                "Supplies zinc, a critical nutrient for plant growth, enzyme activity, and hormone production",
                "Effectively treats zinc deficiencies that cause stunted growth, reduced leaf size, interveinal chlorosis, and delayed maturity",
                "Promotes higher yields, better fruit quality, and overall plant health",
                "Suitable for soil application, foliar spray, fertigation, and hydroponics"
            ],
            "Application": [
                "Soil Application: Apply 1–2 kg per acre by mixing with 50–100 kg of organic manure or soil. Broadcast or apply directly to the root zone before irrigation for better zinc availability.",
                "Foliar Spray: Dissolve 0.5–1 gram per liter of water (250–500 grams per acre) and spray on plant leaves to enhance enzyme activity, growth, and chlorophyll production. Apply early morning or late afternoon to avoid leaf burn.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 500 grams – 1 kg per acre in 100–200 liters of water and applying in multiple splits for steady zinc supply.",
                "Drenching: Dissolve 500 grams – 1 kg per acre in 200 liters of water and apply directly to the root zone to improve root and shoot growth and prevent zinc deficiency."
            ],
            "Advantages": [
                "High bioavailability: Zinc remains stable and available for plant uptake, even in challenging soil conditions",
                "Rapidly addresses zinc deficiency symptoms like stunted growth and yellowing leaves",
                "Fully water-soluble, making it easy to apply in various systems",
                "Effective in acidic, alkaline, and saline soils",
                "Enhances photosynthesis, enzyme activity, and overall plant development",
                "Environmentally friendly: Reduces zinc runoff and ensures efficient nutrient use",
                "Versatile and suitable for a variety of crops, including cereals, fruits, vegetables, and ornamentals"
            ]
        }
        ,
        "Boron 20% Powder":
        {
            "General Details": "Boron 20% Powder is a concentrated, water-soluble fertilizer designed to provide plants with essential boron. This micronutrient is vital for cell wall development, nutrient transportation, flowering, and fruiting. It is widely used in agriculture to correct boron deficiencies and enhance crop quality and yield.",
            "Composition": {
                "Boron (B)": "20%"
            },
            "Agricultural Uses": [
                "Provides an essential micronutrient required for healthy plant growth, particularly for cell wall strength and reproductive development",
                "Corrects boron deficiencies that cause hollow stems, brittle leaves, and poor fruit/seed development",
                "Improves flowering, pollination, fruit set, and seed production in crops",
                "Suitable for soil and foliar applications in a wide range of crops, including vegetables, fruits, oilseeds, and cereals"
            ],
            "Application": [
                "Soil Application: Apply 1–2 kg per acre by mixing with organic manure or soil. Broadcast or apply before irrigation to improve nutrient availability and prevent boron deficiency.",
                "Foliar Spray: Dissolve 0.5–1 gram per liter of water (250–500 grams per acre) and spray on plant leaves to enhance flowering, fruit setting, and overall plant health. Apply in the early morning or late afternoon to avoid leaf burn.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 500 grams – 1 kg per acre in 100–200 liters of water and applying in multiple splits for efficient boron uptake.",
                "Drenching: Dissolve 500 grams – 1 kg per acre in 200 liters of water and apply directly to the root zone to support root development and nutrient transportation."
            ],
            "Advantages": [
                "High boron concentration ensures effective and efficient correction of boron deficiencies",
                "Promotes cell wall integrity, nutrient movement, and reproductive growth",
                "Increases flowering, fruit set, and overall crop quality",
                "Fully water-soluble for easy application through multiple methods",
                "Effective in diverse soil types and agricultural systems",
                "Suitable for a variety of crops, including horticultural, field, and industrial crops",
                "Highly concentrated formulation reduces the amount required per application, making it cost-effective"
            ]
        }
        ,
        "Potassium Humate Shiny Flakes 98%":
        {
            "General Details": "Potassium Humate Shiny Flakes 98% is a highly concentrated organic soil conditioner and plant growth stimulant derived from natural leonardite. Rich in humic and fulvic acids, it enhances soil structure, improves nutrient availability, and promotes healthy plant growth. The shiny flakes are 100% water-soluble, making them ideal for various agricultural and horticultural applications.",
            "Composition": {
                "Humic Acid": "70-80%",
                "Fulvic Acid": "10-15%",
                "Potassium (K2O)": "12-15%",
                "Water Solubility": "98-100%"
            },
            "Agricultural Uses": [
                "Improves soil structure, water retention, and aeration",
                "Enhances the absorption of nitrogen, phosphorus, potassium, and micronutrients",
                "Stimulates root development, seed germination, and overall plant vigor",
                "Improves plant tolerance to drought, salinity, and environmental stress",
                "Promotes soil microbial activity and long-term soil health for sustainable agriculture"
            ],
            "Application": [
                "Soil Application: Apply 2–5 kg per acre by mixing with organic manure or soil. Broadcast or apply directly to the root zone before irrigation to improve soil structure, water retention, and nutrient absorption.",
                "Foliar Spray: Dissolve 1–2 grams per liter of water (250–500 grams per acre) and spray on plant leaves to enhance photosynthesis, stress tolerance, and nutrient uptake. Apply in the early morning or late afternoon.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 500 grams – 1 kg per acre in 100–200 liters of water and applying in multiple splits for better root growth and nutrient efficiency.",
                "Drenching: Dissolve 500 grams – 1 kg per acre in 200 liters of water and apply directly to the root zone to stimulate microbial activity and root development."
            ],
            "Advantages": [
                "High potassium content promotes better flowering and fruiting",
                "Enhances nutrient efficiency, improving uptake and reducing fertilizer wastage",
                "Fully water-soluble for easy and efficient application",
                "Eco-friendly and improves soil fertility without harming the environment",
                "Cost-effective: High concentration reduces the required application rate, making it economical for large-scale use",
                "Supports healthy growth, increases yield, and enhances crop quality",
                "Versatile and suitable for a wide range of crops, including cereals, fruits, vegetables, and ornamentals"
            ]
        }
        ,
        "Calcium Nitrate":
        {
            "General Details": "Calcium Nitrate is a water-soluble, inorganic fertilizer that provides essential nutrients to plants in the form of calcium and nitrogen. It is highly effective in improving plant health, promoting robust growth, and preventing nutrient deficiencies. Calcium Nitrate is widely used in agriculture and horticulture due to its quick nutrient availability and compatibility with various crops and soil types.",
            "Composition": {
                "Calcium (Ca)": "18-19%",
                "Nitrogen (N)": "15.5% (in nitrate form)"
            },
            "Agricultural Uses": [
                "Provides calcium for cell wall strength, reducing physiological disorders like blossom-end rot in tomatoes, peppers, and cucumbers",
                "Supplies nitrate nitrogen, which is readily absorbed by plants and promotes vegetative growth",
                "Enhances fruit firmness, shelf life, and overall crop quality",
                "Helps in reducing soil salinity and improving soil structure",
                "Supports plant resistance to stress factors like drought and temperature fluctuations"
            ],
            "Application": [
                "Soil Application: Apply 8–10 kg per acre by broadcasting or mixing with organic manure. Incorporate into the soil before irrigation for better calcium and nitrogen availability.",
                "Foliar Spray: Dissolve 1–2 grams per liter of water (500 grams – 1 kg per acre) and spray on plant leaves to correct calcium deficiency and improve fruit quality. Apply during early morning or late afternoon to avoid leaf burn.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 5–10 kg per acre in 200–400 liters of water and applying in multiple splits for efficient nutrient uptake.",
                "Drenching: Dissolve 5–10 kg per acre in 200 liters of water and apply directly to the root zone to enhance root development and prevent calcium-related disorders like blossom end rot."
            ],
            "Advantages": [
                "Provides calcium and nitrogen in forms that are immediately available for plant uptake",
                "Effectively addresses calcium and nitrate nitrogen deficiencies that can harm plant health and yield",
                "Enhances fruit size, firmness, and shelf life",
                "Helps reduce soil salinity and balances soil pH levels",
                "Suitable for a wide range of crops, including fruits, vegetables, ornamentals, and cereals",
                "Fully water-soluble, making it easy to use in various application methods",
                "Eco-friendly, promotes sustainable farming by reducing nutrient leaching and improving fertilizer efficiency"
            ]
        }
        ,
        "Green Seaweeds Extracts Powder":
        {
            "General Details": "Green Seaweeds Extracts Powder is a natural, organic plant growth enhancer derived from sustainably harvested green seaweed. It is rich in bioactive compounds, minerals, amino acids, and plant hormones such as cytokinins and auxins, which stimulate plant growth and development. Known for its environmental benefits, it supports sustainable farming practices while improving soil and crop health.",
            "Composition": {
                "Seaweed Extracts": "95-98%",
                "Minerals": "Magnesium, calcium, and potassium",
                "Plant Hormones": "Cytokinins, auxins, and gibberellins",
                "Amino Acids": "Essential amino acids for plant metabolism",
                "Organic Matter": "50-70%"
            },
            "Agricultural Uses": [
                "Promotes root and shoot growth through natural plant hormones",
                "Helps plants withstand environmental stresses like drought, heat, and salinity",
                "Improves the absorption of macronutrients and micronutrients",
                "Enriches soil fertility and microbial activity",
                "Enhances flower and fruit set, improving overall yield and quality"
            ],
            "Application": [
                "Soil Application: Apply 2–5 kg per acre by mixing with organic manure or soil. Broadcast or apply directly to the root zone before irrigation for improved soil health and nutrient uptake.",
                "Foliar Spray: Dissolve 1–2 grams per liter of water (250–500 grams per acre) and spray on plant leaves for enhanced growth, stress resistance, and nutrient absorption. Apply early morning or late afternoon to avoid leaf burn.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 500 grams – 1 kg per acre in 100–200 liters of water and applying in multiple splits for steady nutrient supply.",
                "Drenching: Dissolve 500 grams – 1 kg per acre in 200 liters of water and apply directly to the root zone to promote root development and microbial activity."
            ],
            "Advantages": [
                "Derived from green seaweeds, it is environmentally friendly and safe for use in organic farming",
                "Strengthens plants against pests, diseases, and environmental stressors",
                "Improves fruit size, flavor, color, and shelf life",
                "Increases microbial activity and soil fertility over time",
                "Easily dissolves in water for convenient application",
                "Suitable for a wide variety of crops, including vegetables, fruits, cereals, and ornamentals",
                "Promotes eco-friendly and sustainable agricultural practices"
            ]
        }
        ,
        "Sulfur Powder":
        {
            "General Details": "Sulfur powder is a fine, yellow crystalline substance derived from natural sulfur deposits. It is widely used in agriculture as a fungicide, pesticide, and soil conditioner to enhance crop growth and soil health.",
            "Composition": {
                "Elemental Sulfur (S)": "Pure sulfur, essential for plant growth and soil conditioning"
            },
            "Agricultural Uses": [
                "Soil Conditioner: Lowers soil pH for acid-loving crops like blueberries, strawberries, and citrus",
                "Fungicide: Controls powdery mildew, rust, and other fungal diseases in crops such as grapes, apples, and vegetables",
                "Pesticide: Effective against mites, insects, and certain pests",
                "Nutrient Source: Provides sulfur for plant protein and enzyme synthesis"
            ],
            "Application": [
                "Soil Application: Apply 5–10 kg per acre by broadcasting or mixing with organic manure or soil. Best applied before irrigation or rainfall for better absorption.",
                "Foliar Spray: Dissolve 3–5 grams per liter of water (1–2 kg per acre) and spray on plant leaves to prevent sulfur deficiency. Avoid spraying during peak sunlight hours.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 2–5 kg per acre in 200–400 liters of water and applying in multiple splits.",
                "Drenching: Dissolve 2–5 kg per acre in 200 liters of water and apply directly to the root zone for efficient sulfur uptake."
            ],
            "Advantages": [
                "Improves soil fertility and crop health",
                "Cost-effective and versatile for multiple agricultural applications",
                "Non-toxic to crops when used appropriately",
                "Environmentally friendly alternative to synthetic fungicides and pesticides"
            ]
        },
        "00:00:50":
        {
            "General Details": "00:00:50 is a water-soluble fertilizer with a high concentration of potassium (K). It is widely used as a specialized fertilizer for crops requiring higher potassium levels during specific growth stages, such as flowering and fruiting. With no nitrogen or phosphorus content, it ensures targeted potassium supplementation without altering other nutrient balances in the soil.",
            "Composition": {
                "Potassium (K2O)": "50%",
                "Nitrogen (N)": "0%",
                "Phosphorus (P2O5)": "0%",
                "Water Solubility": "100%"
            },
            "Agricultural Uses": [
                "Provides a rich source of potassium, essential for enzyme activation, water regulation, and carbohydrate transport in plants",
                "Enhances fruit size, weight, color, and sugar content, resulting in better quality and yield",
                "Improves plant resistance to abiotic stresses like drought, salinity, and heat",
                "Suitable for use during flowering and fruiting stages, when potassium demand is high"
            ],
            "Application": [
                "Soil Application: Apply 5–10 kg per acre, either directly or mixed with other fertilizers, for potassium enrichment. Apply before irrigation.",
                "Foliar Spray: Dissolve 5–10 grams per liter of water (2–5 kg per acre) and spray on plant leaves for quick potassium absorption. Apply during early morning or late afternoon to avoid leaf burn.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 5–10 kg per acre in 200–400 liters of water and applying in multiple splits.",
                "Drenching: Dissolve 5–10 kg per acre in 200 liters of water and apply directly to the root zone for better absorption."
            ],
            "Advantages": [
                "Delivers a concentrated dose of potassium for optimal plant growth and development",
                "Provides targeted potassium supplementation without altering the soil's nutrient balance",
                "Dissolves completely in water for ease of use and efficient application",
                "Enhances fruit size, color, flavor, and shelf life",
                "Suitable for a variety of crops, including fruits, vegetables, cereals, and ornamentals",
                "Strengthens plants' ability to withstand environmental stresses",
                "Reduces nutrient wastage and supports sustainable farming practices"
            ]
        }
        ,
        "19:19:19":
        {
            "General Details": "19:19:19 is a balanced, water-soluble NPK (Nitrogen, Phosphorus, Potassium) fertilizer designed to provide equal proportions of essential macronutrients. It is highly effective for general crop nutrition and promotes healthy growth during all stages of plant development. Its balanced formulation makes it versatile and suitable for a wide range of crops, ensuring optimal growth and yield.",
            "Composition": {
                "Nitrogen (N)": "19%",
                "Phosphorus (P2O5)": "19%",
                "Potassium (K2O)": "19%",
                "Water Solubility": "100%"
            },
            "Agricultural Uses": [
                "Provides balanced nutrition for plants during all growth stages",
                "Supports root development, leaf growth, flowering, and fruiting",
                "Supplies essential nutrients for maintaining soil health and productivity",
                "Boosts overall plant vigor and productivity, enhancing yield and quality"
            ],
            "Application": [
                "Soil Application: Apply 5–10 kg per acre by broadcasting or mixing with organic manure. Incorporate into the soil before irrigation to provide balanced nitrogen, phosphorus, and potassium.",
                "Foliar Spray: Dissolve 4–5 grams per liter of water (2–5 kg per acre) and spray on plant leaves for rapid nutrient absorption and improved vegetative growth. Apply early morning or late afternoon to prevent leaf burn.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 5–10 kg per acre in 200–400 liters of water and applying in multiple splits for uniform nutrient distribution.",
                "Drenching: Dissolve 5–10 kg per acre in 200 liters of water and apply directly to the root zone to promote root development and enhance crop yield."
            ],
            "Advantages": [
                "Provides equal proportions of nitrogen, phosphorus, and potassium for comprehensive plant growth",
                "Fully dissolves in water, ensuring easy application and efficient nutrient uptake",
                "Suitable for all crops, including cereals, fruits, vegetables, ornamentals, and turf",
                "Promotes uniform growth, better fruiting, and improved produce quality",
                "Supports healthy root and shoot development, leading to higher yields",
                "Reduces nutrient leaching and ensures maximum nutrient use efficiency",
                "Can be applied using various methods like soil, foliar, and fertigation, catering to different farming needs"
            ]
        }
        ,
        "20:20:20":
        {
            "General Details": "20:20:20 is a fully water-soluble, balanced NPK (Nitrogen, Phosphorus, Potassium) fertilizer designed to meet the nutritional needs of plants during all stages of growth. Its balanced composition ensures optimal development, making it suitable for a wide range of crops. It dissolves completely in water, allowing for efficient application through foliar spray, fertigation, or hydroponics.",
            "Composition": {
                "Nitrogen (N)": "20%",
                "Phosphorus (P2O5)": "20%",
                "Potassium (K2O)": "20%",
                "Water Solubility": "100%"
            },
            "Agricultural Uses": [
                "Supplies all three essential macronutrients in equal proportions for balanced plant growth",
                "Boosts vegetative growth, root development, flowering, and fruiting",
                "Addresses deficiencies of nitrogen, phosphorus, and potassium in soils and plants",
                "Ideal for a variety of crops, including vegetables, fruits, cereals, ornamentals, and turfgrass"
            ],
            "Application": [
                "Soil Application: Apply 5–10 kg per acre by broadcasting or mixing with organic manure. Incorporate into the soil before irrigation to ensure balanced nutrient availability.",
                "Foliar Spray: Dissolve 4–5 grams per liter of water (2–5 kg per acre) and spray on plant leaves for rapid nutrient absorption and enhanced vegetative growth. Apply in the early morning or late afternoon to avoid leaf burn.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 5–10 kg per acre in 200–400 liters of water and applying in multiple splits for continuous nutrient supply.",
                "Drenching: Dissolve 5–10 kg per acre in 200 liters of water and apply directly to the root zone to support root development and boost crop yield."
            ],
            "Advantages": [
                "Provides equal proportions of nitrogen, phosphorus, and potassium for comprehensive plant health and growth",
                "Completely dissolves in water, ensuring ease of use and efficient absorption by plants",
                "Suitable for all crops and growth stages, from vegetative to reproductive phases",
                "Promotes better root development, greener foliage, and improved flowering and fruiting",
                "Leads to higher productivity and superior crop quality",
                "Can be used in soil, foliar, fertigation, and hydroponic systems",
                "Reduces nutrient wastage through efficient delivery and uptake"
            ]
        }
        ,
        "13:40:13":
        {
            "General Details": "13:40:13 is a water-soluble fertilizer with a unique NPK (Nitrogen, Phosphorus, Potassium) ratio of 13% nitrogen, 40% phosphorus, and 13% potassium. This formulation is designed to provide plants with balanced nutrition, particularly during stages requiring high phosphorus levels such as root development, flowering, and fruiting. It promotes strong root systems, enhances crop quality, and supports both vegetative and reproductive growth.",
            "Composition": {
                "Nitrogen (N)": "13%",
                "Phosphorus (P2O5)": "40%",
                "Potassium (K2O)": "13%",
                "Water Solubility": "100%"
            },
            "Agricultural Uses": [
                "Provides a high dose of phosphorus for root development, energy transfer, and flowering",
                "Ideal for crops in early growth stages, promoting strong root establishment",
                "Enhances flower formation, fruit set, and overall yield",
                "Improves nutrient availability in the soil for efficient plant uptake",
                "Suitable for a variety of crops, including vegetables, fruits, cereals, and ornamentals"
            ],
            "Application": [
                "Soil Application: Apply 5–10 kg per acre by broadcasting or mixing with organic manure. Incorporate into the soil before irrigation to supply balanced nitrogen, phosphorus, and potassium.",
                "Foliar Spray: Dissolve 4–5 grams per liter of water (2–5 kg per acre) and spray on plant leaves to promote root development, flowering, and fruit setting. Apply early morning or late afternoon to avoid leaf burn.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 5–10 kg per acre in 200–400 liters of water and applying in multiple splits for efficient phosphorus uptake.",
                "Drenching: Dissolve 5–10 kg per acre in 200 liters of water and apply directly to the root zone to improve root growth and overall plant health."
            ],
            "Advantages": [
                "Delivers an extra boost of phosphorus, essential for root development, flowering, and fruit production",
                "Provides balanced nitrogen for growth and potassium for stress resistance",
                "Completely dissolves in water, ensuring ease of use and efficient absorption",
                "Promotes strong early growth and root system establishment",
                "Suitable for a wide range of crops, including fruits, vegetables, and ornamental plants",
                "Increases flower and fruit set, enhancing overall yield and quality",
                "Can be applied via soil, foliar spray, fertigation, or hydroponics for flexible usage"
            ]
        }
        ,
        "13:00:45":
        {
            "General Details": "13:00:45 is a water-soluble fertilizer with a unique NPK (Nitrogen, Phosphorus, Potassium) ratio of 13% nitrogen, 0% phosphorus, and 45% potassium. This formulation is specifically designed to provide plants with a high amount of potassium, which is crucial for improving crop quality, fruit set, and overall stress resistance. It is ideal for crops in reproductive stages like flowering and fruiting or for soils that are already rich in phosphorus but require additional potassium.",
            "Composition": {
                "Nitrogen (N)": "13%",
                "Phosphorus (P2O5)": "0%",
                "Potassium (K2O)": "45%",
                "Water Solubility": "100%"
            },
            "Agricultural Uses": [
                "Provides a concentrated source of potassium to enhance fruit quality and plant stress resistance.",
                "Ideal for crops during flowering and fruiting stages, promoting better fruit set, larger fruit size, and enhanced sugar content.",
                "Strengthens plant cell walls, improving tolerance to drought, salinity, and extreme temperatures.",
                "Suitable for fruit-bearing crops, vegetables, ornamentals, and turfgrass."
            ],
            "Application": [
                "Soil Application: Apply 5–10 kg per acre by broadcasting or mixing with organic manure. Incorporate into the soil before irrigation to ensure proper potassium and nitrogen supply.",
                "Foliar Spray: Dissolve 4–5 grams per liter of water (2–5 kg per acre) and spray on plant leaves to enhance fruit development, stress resistance, and overall plant health. Apply early morning or late afternoon to avoid leaf burn.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 5–10 kg per acre in 200–400 liters of water and applying in multiple splits for steady potassium availability.",
                "Drenching: Dissolve 5–10 kg per acre in 200 liters of water and apply directly to the root zone to improve root strength and increase crop yield."
            ],
            "Advantages": [
                "Supplies a concentrated source of potassium, supporting flower and fruit development, crop quality, and yield.",
                "Enhances plant resilience to drought, heat, and salinity stress, especially in challenging growing conditions.",
                "Improves fruit size, color, and sugar content, increasing crop value and marketability.",
                "Completely dissolves in water for easy application and efficient nutrient uptake.",
                "Suitable for various application methods, including soil, foliar spray, fertigation, and hydroponics.",
                "Increases overall crop yield and quality, particularly for fruits and vegetables."
            ]
        }
        ,
        "12:61:00":
        {
            "General Details": "12:61:00 is a water-soluble fertilizer with a high phosphorus formulation of 12% nitrogen, 61% phosphorus, and 0% potassium. It is specially designed to support the initial stages of plant growth, focusing on enhancing root development, energy transfer, and flower/fruit set. The low nitrogen content makes it ideal for soils that already have sufficient nitrogen but need extra phosphorus to promote early growth or boost reproductive phases.",
            "Composition": {
                "Nitrogen (N)": "12%",
                "Phosphorus (P2O5)": "61%",
                "Potassium (K2O)": "0%",
                "Water Solubility": "100%"
            },
            "Agricultural Uses": [
                "Provides a concentrated dose of phosphorus, crucial for root development, energy transfer, and plant vigor.",
                "Perfect for crops in the early stages, helping establish strong root systems for healthy development.",
                "Supports crops in reproductive stages, enhancing flower formation and fruit set.",
                "Suitable for phosphorus-deficient soils, promoting long-term soil fertility.",
                "Works well with vegetables, fruits, and ornamental plants."
            ],
            "Application": [
                "Soil Application: Apply 5–10 kg per acre by broadcasting or mixing with organic manure. Best applied before irrigation to provide a high phosphorus boost for root and early plant development.",
                "Foliar Spray: Dissolve 4–5 grams per liter of water (2–5 kg per acre) and spray on plant leaves to promote flowering, fruit setting, and strong root growth. Apply early morning or late afternoon to avoid leaf burn.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 5–10 kg per acre in 200–400 liters of water and applying in multiple splits for efficient phosphorus uptake.",
                "Drenching: Dissolve 5–10 kg per acre in 200 liters of water and apply directly to the root zone to improve root establishment and early growth stages."
            ],
            "Advantages": [
                "Delivers a concentrated dose of phosphorus to enhance root development, energy transfer, and reproductive success.",
                "Ideal for young plants or those in transplanting stages that require strong roots for better nutrient and water uptake.",
                "Increases flower and fruit set, leading to higher yields and improved crop quality.",
                "Fully water-soluble, ensuring easy application and rapid nutrient absorption.",
                "Suitable for a wide range of crops, especially those in early growth stages or transitioning to reproductive phases.",
                "Improves the uptake of other essential nutrients by optimizing root development and overall plant health."
            ]
        }
        ,
        "00:60:20":
        {
            "General Details": "00:60:20 is a highly concentrated water-soluble fertilizer with a formulation of 0% nitrogen, 60% phosphorus, and 20% potassium. This fertilizer is designed to provide crops with a high level of phosphorus, promoting strong root development and improving flower and fruit set. The potassium helps improve plant stress tolerance, contributing to overall plant health. This formulation is ideal for plants in the flowering and fruiting stages or for soils that need a phosphorus boost.",
            "Composition": {
                "Nitrogen (N)": "0%",
                "Phosphorus (P2O5)": "60%",
                "Potassium (K2O)": "20%",
                "Water Solubility": "100%"
            },
            "Agricultural Uses": [
                "Provides high phosphorus concentration to support root growth, energy transfer, and overall plant vigor.",
                "Ideal for crops in reproductive stages, enhancing flower formation and improving fruit set and size.",
                "Potassium content improves plant tolerance to environmental stresses such as drought, heat, and salinity.",
                "Corrects phosphorus deficiencies in soils, promoting long-term soil health.",
                "Works well for vegetables, fruits, and ornamental plants, especially during flowering and fruiting stages."
            ],
            "Application": [
                "Soil Application: Apply 5–10 kg per acre by broadcasting or mixing with organic manure. Best applied before irrigation to improve root development and flowering.",
                "Foliar Spray: Dissolve 4–5 grams per liter of water (2–5 kg per acre) and spray on plant leaves to enhance flowering, fruit setting, and overall plant health. Apply early morning or late afternoon to avoid leaf burn.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 5–10 kg per acre in 200–400 liters of water and applying in multiple splits for efficient phosphorus and potassium uptake.",
                "Drenching: Dissolve 5–10 kg per acre in 200 liters of water and apply directly to the root zone to promote strong root growth and increase fruit and grain formation."
            ],
            "Advantages": [
                "Delivers a significant dose of phosphorus essential for root development, energy transfer, and improved reproductive growth.",
                "Supports better flower formation and fruit set, leading to higher yields.",
                "Potassium enhances plant resistance to environmental stresses like heat, drought, and salinity.",
                "Fully dissolves in water for easy application and quick nutrient uptake.",
                "Potassium supports overall plant health, improving disease resistance and plant vigor.",
                "Suitable for soil, foliar, fertigation, and hydroponic systems, making it highly adaptable for various farming methods."
            ]
        }
        ,
        "00:52:34":
        {
            "General Details": "00:52:34 is a specialized, water-soluble fertilizer with a formulation of 0% nitrogen, 52% phosphorus, and 34% potassium. This fertilizer is designed to meet the nutrient demands of plants during their reproductive phases, especially in flowering and fruiting. It provides an excellent source of phosphorus to enhance root development and flower formation, while the potassium aids in stress resistance and improves the overall quality of fruits and flowers.",
            "Composition": {
                "Nitrogen (N)": "0%",
                "Phosphorus (P2O5)": "52%",
                "Potassium (K2O)": "34%",
                "Water Solubility": "100%"
            },
            "Agricultural Uses": [
                "Provides a high concentration of phosphorus for enhanced root development and energy transfer.",
                "Supports better flower formation, fruit set, and improved fruit quality (size, color, and flavor).",
                "Potassium improves plant tolerance to adverse environmental conditions such as drought, heat, and salinity.",
                "Useful in correcting phosphorus deficiencies in soils and ensuring healthy root growth.",
                "Ideal for fruiting and flowering crops, such as vegetables, fruits, ornamental plants, and certain legumes."
            ],
            "Application": [
                "Soil Application: Apply 5–10 kg per acre by broadcasting or mixing with organic manure. Best applied before irrigation to improve root development, flowering, and fruit setting.",
                "Foliar Spray: Dissolve 4–5 grams per liter of water (2–5 kg per acre) and spray on plant leaves to enhance flowering, fruit development, and stress resistance. Apply early morning or late afternoon to avoid leaf burn.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 5–10 kg per acre in 200–400 liters of water and applying in multiple splits for efficient phosphorus and potassium absorption.",
                "Drenching: Dissolve 5–10 kg per acre in 200 liters of water and apply directly to the root zone to strengthen root growth and improve nutrient uptake."
            ],
            "Advantages": [
                "Provides essential phosphorus for strong root development, energy transfer, and improved reproductive growth.",
                "Improves flower set and fruit quality, leading to better yield and marketability.",
                "Potassium helps plants better withstand environmental stresses, including drought, heat, and disease pressure.",
                "Dissolves completely in water, ensuring efficient uptake by plants and preventing clogging in irrigation systems.",
                "Potassium enhances stress resistance and contributes to overall plant health and disease resistance.",
                "Suitable for use in soil, foliar spraying, fertigation, and hydroponic systems, allowing flexibility in farming practices."
            ]
        }
        ,
        "Copper Sulfate":
        {
            "General Details": "Copper sulfate (CuSO₄) is an inorganic compound widely used in agriculture as a fungicide, herbicide, and soil additive. It is a blue, crystalline substance that provides a source of copper, an essential micronutrient for plant growth. Copper plays a crucial role in various plant processes, including photosynthesis, respiration, and the synthesis of proteins. Copper sulfate is commonly used to correct copper deficiencies in soils and to protect crops from fungal diseases.",
            "Composition": {
                "Copper (Cu)": "25% (as copper sulfate)",
                "Sulfur (S)": "33.5%",
                "Water Solubility": "Soluble in water, ensuring easy application and absorption by plants."
            },
            "Agricultural Uses": [
                "Fungicide: Controls fungal diseases such as downy mildew, powdery mildew, and blight on various crops.",
                "Fungicide for Seed Treatment: Prevents seedborne diseases by treating seeds before planting.",
                "Soil Amendments: Corrects copper deficiencies in soils, especially in crops like cereals, legumes, and vegetables.",
                "Algaecide: Effective in controlling algae growth in irrigation systems and ponds.",
                "Animal Feed Additive: Provides copper as a supplement in animal feed, ensuring proper growth and health of livestock."
            ],
            "Application": [
                "Soil Application: Apply 2–5 kg per acre by mixing with organic manure or soil. Broadcast or apply directly to the root zone before irrigation to correct copper deficiency and improve enzyme activity in plants.",
                "Foliar Spray: Dissolve 1–2 grams per liter of water (250–500 grams per acre) and spray on plant leaves to enhance disease resistance, chlorophyll production, and overall plant health. Apply early morning or late afternoon to avoid leaf burn.",
                "Fertigation: Suitable for use in drip or sprinkler irrigation systems by dissolving 500 grams – 1 kg per acre in 100–200 liters of water and applying in multiple splits for steady copper availability.",
                "Drenching: Dissolve 500 grams – 1 kg per acre in 200 liters of water and apply directly to the root zone to improve root strength, enzyme activation, and overall nutrient uptake."
            ],
            "Advantages": [
                "Provides an essential micronutrient that helps in photosynthesis, enzyme activation, and overall plant growth.",
                "Protects crops from a wide range of fungal diseases, enhancing plant health and productivity.",
                "Helps to correct copper deficiencies in soil, promoting balanced nutrient levels for healthy crop growth.",
                "Maintains clean irrigation water and prevents algae growth in agricultural ponds and water systems.",
                "Relatively inexpensive compared to other agricultural chemicals, offering an affordable solution for nutrient deficiencies and disease control.",
                "Suitable for a variety of crops, including fruits, vegetables, cereals, and ornamentals."
            ]
        }
        ,
        "Special Slurry Formulation": 
        {
            "General Details": "Special Slurry Formulation is a bio-nutrient-rich, microbial fertilizer made from natural ingredients organic sources. It is fermented over 45 days to promote beneficial microbial activity and enhance soil fertility. This slurry is designed to rejuvenate the soil before planting, improve microbial diversity, and promote plant health and root development in an eco-friendly way.",

            "Composition": {
                "Organic Carbon": "High",
                "Nitrogen (Natural Source)": "Moderate to High",
                "Microbial Culture": "Rich",
                "Fats & Sugars": "Moderate",
                "Moisture": "Present"
            },

            "Agricultural Uses": [
                "Improves soil fertility and microbial activity by introducing beneficial bacteria and fungi.",
                "Enhances root growth and seedling establishment through microbial support.",
                "Acts as a natural soil conditioner by increasing organic matter and moisture retention.",
                "Reduces soil-borne diseases through improved microbial balance.",
                "Prepares beds for vegetable, fruit, and cereal crops by enriching the soil prior to sowing or transplanting."
            ],

            "Application": [
                "Soil Application: Apply 5–10 litres per bed or 50–100 litres per acre 7–10 days before planting to allow microbial colonization.",
                "Compost Enrichment: Add 10–20 litres per ton of compost to accelerate decomposition and nutrient cycling.",
                "In-Crop Drenching (Optional): Dilute at 1:10 with water and apply around the base of plants once every 15–30 days to promote root health and microbial support.",
                "Not Recommended for Foliar Use: Due to thick organic content, this slurry is best suited for soil applications."
            ],

            "Advantages": [
                "Boosts microbial diversity in the soil, leading to improved nutrient availability and healthier root systems.",
                "Enhances soil structure and aeration, allowing better water and nutrient absorption.",
                "Reduces dependency on chemical fertilizers, offering a cost-effective and sustainable alternative.",
                "Improves plant tolerance to pests and diseases by building a balanced soil ecosystem.",
                "Ideal for organic farming systems and regenerative agriculture practices.",
                "Can be made using on-farm inputs, reducing input costs and supporting local sustainability."
            ]
        }
        ,
    };

    modalTriggers.forEach(trigger => {
        trigger.addEventListener("click", function (event) {
            event.preventDefault();

            const productElement = this.closest(".product");
            const productName = productElement.getAttribute("data-name");
            const productPrice = productElement.getAttribute("data-price");
            const productImage = productElement.querySelector("img").src;
            const productInfo = productDetails[productName] || {};

            let detailsTable = "<table border='2' class='product-table'><tbody>";
            for (const key in productInfo) {
                if (Array.isArray(productInfo[key])) {
                    detailsTable += `<tr><td><strong>${key}:</strong></td><td><ul>`;
                    productInfo[key].forEach(item => {
                        detailsTable += `<li>${item}</li>`;
                    });
                    detailsTable += "</ul></td></tr>";
                } else if (typeof productInfo[key] === "object") {
                    detailsTable += `<tr><td><strong>${key}:</strong></td><td>`;
                    for (const subKey in productInfo[key]) {
                        detailsTable += `<strong>${subKey}:</strong> ${productInfo[key][subKey]}<br>`;
                    }
                    detailsTable += "</td></tr>";
                } else {
                    detailsTable += `<tr><td><strong>${key}:</strong></td><td>${productInfo[key]}</td></tr>`;
                }
            }
            detailsTable += "</tbody></table>";

            const popupContent = `
                <html>
                <head>
                    <title>${productName} - Details</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .product-image { max-width: 100%; height: auto; }
                        .product-table { width: 100%; border-collapse: collapse; }
                        .product-table td, .product-table th { border: 1px solid #ddd; padding: 8px; }
                        .product-table th { background-color: #f2f2f2; }
                    </style>
                </head>
               <body>
    <div class="product-container">
        <h3>${productName}</h3>
        <img src="${productImage}" alt="${productName}" class="product-image">
        <p><strong>Price:</strong> ₹${productPrice}/kg</p>
        <h4>Product Details:</h4>
        ${detailsTable}
    </div>
</body>

<style>
    .product-container {
        text-align: center;
        border: 2px solid #000000;    /* Adds a 2px solid black border */
        padding: 20px;               /* Adds some space inside the border */
        border-radius: 5px;          /* Optional: rounds the corners */
        max-width: 500px;           /* Optional: limits the container width */
        margin: 20px auto;          /* Optional: centers the container and adds outside spacing */
    }
</style>
                </html>
            `;

            const popupWindow = window.open("", "Product Details", "width=600,height=600,scrollbars=yes");
            popupWindow.document.write(popupContent);
            popupWindow.document.close();
        });
    });
});

// Floating1 button behaviour 
document.getElementById("scrollToCartBtn").addEventListener("click", function () {
    document.getElementById("cartDetails").scrollIntoView({ behavior: "smooth" });
});

// floating button 2  
document.getElementById("main-btn").addEventListener("click", function () {
    let subButtons = document.getElementById("sub-buttons");
    subButtons.style.display = subButtons.style.display === "flex" ? "none" : "flex";
});

// Add event listener to all sub-buttons
const subButtonsContainer = document.getElementById("sub-buttons");
const subButtons = subButtonsContainer.querySelectorAll("button");

subButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Start 1-second timer to hide sub-buttons
        setTimeout(() => {
            subButtonsContainer.style.display = "none";
        }, 000);
    });
});



//function for Organic Products button
document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".floating-btn.sub-btn1");
    const productsSection = document.getElementById("products1");

    if (button && productsSection) {
        button.addEventListener("click", function () {
            productsSection.style.display = "block";
            productsSection.scrollIntoView({ behavior: "smooth" });
        });
    }
});


//function for Micronutrients Products button
document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".floating-btn.sub-btn2");
    const productsSection = document.getElementById("products2");

    if (button && productsSection) {
        button.addEventListener("click", function () {
            productsSection.style.display = "block";
            productsSection.scrollIntoView({ behavior: "smooth" });
        });
    }
});

//function for NPK Special Formulation Products button
document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".floating-btn.sub-btn3");
    const productsSection = document.getElementById("products3");

    if (button && productsSection) {
        button.addEventListener("click", function () {
            productsSection.style.display = "block";
            productsSection.scrollIntoView({ behavior: "smooth" });
        });
    }
});

//function for NPK Special Formulation Products button
document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".floating-btn.sub-btn4");
    const productsSection = document.getElementById("products4");

    if (button && productsSection) {
        button.addEventListener("click", function () {
            productsSection.style.display = "block";
            productsSection.scrollIntoView({ behavior: "smooth" });
        });
    }
});

//function for Special Slurry Formulation button
document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".floating-btn.sub-btn5");
    const productsSection = document.getElementById("products5");

    if (button && productsSection) {
        button.addEventListener("click", function () {
            productsSection.style.display = "block";
            productsSection.scrollIntoView({ behavior: "smooth" });
        });
    }
});
