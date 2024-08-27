window.addEventListener("DOMContentLoaded", () => {
    fetch("/fetch-products")
        .then((data) => data.json())
        .then((products) => {
            document.getElementById("productsContainer").innerHTML = products.map((product) => {
                return `
                <div class="card m-3 custom-card">
                    <image src="../images/${product.image}" class="card-image-top card-image" alt="${product.name}">
                    <div class="card-body">
                        <div class="name-price-contianer">
                            <h3 class="card-title"> ${product.name} </h3>
                            <h4 class="card-title  fw-light"> $${product.price} </h4>
                        </div>
                        <div>
                            <a href="/edit/${product.id}" class="btn btn-outline-dark mx-1 mt-4 edit-buttons">
                                <i class="bi bi-pencil-fill"></i>
                            </a>
                            <a href="/delete/${product.id}" class="btn btn-outline-dark mx-1 mt-4 edit-buttons" onclick="deleteHandler()">
                                <i class="bi bi-trash-fill"></i>
                            </a>
                        </div>
                    </div>
                </div>
                `
            })
        })
})