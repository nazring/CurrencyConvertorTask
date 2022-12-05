const addValyutaBtn = document.querySelector('#add_valyuta');
const searchDiv = document.querySelector('.search');
const show_valyuta_btn = document.querySelector('#show_valyuta_btn');
const showValyutaSelectBox = document.querySelector('#show_valyuta');
const main_currencies_list = document.querySelector('.main-currencies-list');

let currencies = [];
let selectedCurrencies = ['USD','GBP','AZN', 'EUR', 'RUB'];
let mainCurrencies = 'AZN';
const baseUrl = 'https://api.exchangerate.host/';
const symbolsUrl = new URL('/symbols', baseUrl);
const converterUrl = new URL('/convert', baseUrl);
const currency = {date: null, result: 0};
const getCurrency = async (v) => {
    converterUrl.searchParams.set('from', mainCurrencies);
    converterUrl.searchParams.set('to', v);
    await fetch(converterUrl).then(res => res.json()).then(data => {
        console.log(data);
        currency.date = data.date;
        currency.result = data.result;
    });
    
    console.log(currency);
    const main_currencies_item = document.createElement('div');
    main_currencies_item.classList.add('main-currencies-item');
    main_currencies_item.id = v + '_currency';
    main_currencies_item.innerHTML= `<div class="div-header">${v}</div>
    <input type="text"/> <div class="div-footer">
    <p>${currency.date}</p>
    <p>1 ${mainCurrencies} = ${currency.result} ${v}</p>
    </div>`;
    main_currencies_list.append(main_currencies_item);
}

selectedCurrencies.map(v => {
    getCurrency(v);
});

addValyutaBtn.addEventListener('click', ()=> {
    searchDiv.classList.toggle('none');
});

show_valyuta_btn.addEventListener('click', ()=> {
    showValyutaSelectBox.classList.toggle('none');
});


const symbols = fetch(symbolsUrl).then(res => res.json())
.then(data => {
    Object.keys(data.symbols).map((v, i) => {
        showValyutaSelectBox.options[showValyutaSelectBox.options.length] = new Option(v, v);
    });
});

showValyutaSelectBox.addEventListener('input', (e)=> {
    console.log(e.target.value);
    if(selectedCurrencies.includes(e.target.value)) {
        selectedCurrencies = selectedCurrencies.filter(v => v != e.target.value);
        document.querySelector(`#${e.target.value}_currency`).remove();
    }
    else {
        selectedCurrencies.push(e.target.value);
        getCurrency(e.target.value);
    }
    console.log(selectedCurrencies);
});
