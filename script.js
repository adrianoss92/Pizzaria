let modalQt =1;
let modalKey = 0;
let carrinho = [];
const c = (elemento)=> {
  return document.querySelector(elemento);
}

const cs = (elemento)=> {
  return document.querySelectorAll(elemento);
}


// Listagem das pizzas
pizzaJson.map((pizza, index)=>{
  let pizzaItem = c('.models .pizza-item').cloneNode(true);
  
  pizzaItem.setAttribute('data-key', index)

  pizzaItem.querySelector('.pizza-item--img img').src=pizza.img;

  pizzaItem.querySelector('.pizza-item--name').innerHTML=pizza.name;
  pizzaItem.querySelector('.pizza-item--desc').innerHTML=pizza.description;
  pizzaItem.querySelector('.pizza-item--price').innerHTML=`R$ ${pizza.price.toFixed(2)}`;
  
  pizzaItem.querySelector('a').addEventListener('click', (event)=> {
    event.preventDefault();
    let key = event.target.closest('.pizza-item').getAttribute('data-key');
    modalKey = key;
    modalQt = 1;


    c('.pizzaBig img').src = pizzaJson[key].img;
    c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
    c('.pizzaInfo--size.selected').classList.remove('selected');
    cs('.pizzaInfo--size').forEach((size, sizeIndex) =>{
      if(sizeIndex == 2){
        size.classList.add('selected')
      }
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    })

    c('.pizzaInfo--qt').innerHTML = modalQt; 
    c('.pizzaWindowArea').style.opacity=0;
    c('.pizzaWindowArea').style.display='flex';
    setTimeout(() =>{
      c('.pizzaWindowArea').style.opacity=1;
    }, 200)
  });

  c('.pizza-area').append( pizzaItem );
});

// Eventos do Modal
function fecharModal(){
  c('.pizzaWindowArea').style.opacity=0;
  setTimeout(()=> {
    c('.pizzaWindowArea').style.display='none';
  }, 500)
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
  item.addEventListener('click',fecharModal);
});

c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
  if(modalQt > 1){
    modalQt--;
  }
  c('.pizzaInfo--qt').innerHTML = modalQt;
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
  modalQt++;
  c('.pizzaInfo--qt').innerHTML = modalQt;
});


cs('.pizzaInfo--size').forEach((size, sizeIndex) =>{
  size.addEventListener('click', (event)=>{
    c('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
  });
});

c('.pizzaInfo--addButton').addEventListener('click', ()=>{
  let pizzaTamanho = c('.pizzaInfo--size.selected').getAttribute('data-key');

  let identificador = pizzaJson[modalKey].id+'@'+pizzaTamanho;

  let key = carrinho.findIndex((item)=> item.identifier == identificador)

  if(key > -1){
    carrinho[key].qt += modalQt;
  } else {
    carrinho.push({
      identifier: identificador,
      id: pizzaJson[modalKey].id,
      tamanho: parseInt(pizzaTamanho),
      qt: modalQt
    })
  }
  updateCarrinho();
  fecharModal();
})

c('.menu-openner').addEventListener('click', () => {
  if(carrinho.length > 0) {
      c('aside').style.left = '0';
  }
});
c('.menu-closer').addEventListener('click', ()=>{
  c('aside').style.left = '100vw';
});

function updateCarrinho(){
  c('.menu-openner span').innerHTML = carrinho.length;
  if(carrinho.length > 0){
    c('aside').classList.add('show');
    // fecharModal();
    c('.cart').innerHTML='';
    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for(let i in carrinho){
      let pizzaItem = pizzaJson.find((item) => {
        return item.id == carrinho[i].id
      })

      subtotal += pizzaItem.price * carrinho[i].qt;

      let carrinhoItem = c('.models .cart--item').cloneNode(true);

      let pizzaSizeName;

      switch(carrinho[i].tamanho){
        case 0:
          pizzaSizeName = 'P';
          break;
        case 1:
          pizzaSizeName = 'M';
          break;
        case 2:
          pizzaSizeName = 'G';
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      carrinhoItem.querySelector('img').src = pizzaItem.img;
      carrinhoItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
      carrinhoItem.querySelector('.cart--item--qt').innerHTML = carrinho[i].qt;
      carrinhoItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
        if(carrinho[i].qt > 1){
          carrinho[i].qt--;
        } else {
          carrinho.splice(i, 1)

        }
        updateCarrinho();
      })
      carrinhoItem.querySelector('.cart--item-qtmais').addEventListener('click',() => {
        carrinho[i].qt++;
        updateCarrinho();
      })

      c('.cart').append(carrinhoItem)
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
    c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
    c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

  } else {
    c('aside').classList.remove('show');
    c('aside').style.left = '100vw';
  }
}