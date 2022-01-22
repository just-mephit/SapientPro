function setValidClass(el) {
    el.classList.remove("is-invalid");
    el.classList.add("is-valid");
}

function setInValidClass(el) {
    el.classList.remove("is-valid");
    el.classList.add("is-invalid");
}

const PRICE = 1000;

const spanPaymentConfirm = document.getElementById("payment_confirm_price");

// ===== ORDER TAB =====
const btnOrderIncreaseCount = document.getElementById("order_increase");
const btnOrderDecreaseCount = document.getElementById("order_decrease");
const inpOrderCount = document.getElementById("order_count");
const spanOrderPrice = document.getElementById("order_price");
const btnOrderConfirm = document.getElementById('order_confirm')

btnOrderIncreaseCount.onclick = function() {
    btnOrderConfirm.removeAttribute('disabled' );

    ++inpOrderCount.value;

    const priceText = String(inpOrderCount.value * PRICE);
    spanOrderPrice.innerText = priceText;
    spanPaymentConfirm.innerText = priceText;
}

btnOrderDecreaseCount.onclick = function() {
    if (inpOrderCount.value <= 0) return;

    if (inpOrderCount.value <= 1) {
        --inpOrderCount.value;
        btnOrderConfirm.setAttribute('disabled', '')
        spanOrderPrice.innerText = '0';
        spanPaymentConfirm.innerText = '0';
        return;
    }
    btnOrderConfirm.removeAttribute('disabled');

    --inpOrderCount.value;

    const priceText = String(inpOrderCount.value * PRICE);
    spanOrderPrice.innerText = priceText;
    spanPaymentConfirm.innerText = priceText;
}


inpOrderCount.oninput = function(e) {
    this.value = e.target.value.replace(/[^0-9]/g, '');

    if (this.value[0] === '0' || !this.value) {
        this.value = '0';
        DATA.count = parseInt(this.value);

        btnOrderConfirm.setAttribute('disabled', '')
        spanOrderPrice.innerText = '0';
        spanPaymentConfirm.innerText = '0';
        return;
    }

    btnOrderConfirm.removeAttribute('disabled');

    const priceText = String(this.value * PRICE);
    spanOrderPrice.innerText = priceText;
    spanPaymentConfirm.innerText = priceText;
}
// ===== END ORDER TAB =====

// ===== SHIPPING TAB =====
const inpCity = document.getElementById("city");
const inpAddress = document.getElementById("address");
const inpPhone = document.getElementById("phone");
const btnShippingConfirm = document.getElementById("shipping_confirm");

const autoCompleteJS = new autoComplete({
    selector: '#city',
    data: {
        src: [
            'Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Donetsk', 'Lviv', 'Kryvyj Rih',
            'Mykolaiv', 'Vinnytsia', 'Makiivka', 'Chernihiv', 'Kherson', 'Poltava',
            'Cherkasy', 'Chernivtsi', 'Zhytomyr', 'Sumy', 'Rivne', 'Ivano-Frankivsk',
            'Ternopil', 'Lutsk', 'Uzhhorod', 'Uman'
        ],
        cache: true,
    },
    resultItem: {
        highlight: {
            render: true
        }
    },
    events: {
        input: {
            selection: event => {
                autoCompleteJS.input.value = event.detail.selection.value
            }
        }
    }
});

function checkDisableShippingConfirm() {
    (
        inpCity.classList.contains("is-valid")
        && inpAddress.classList.contains("is-valid")
        && inpPhone.classList.contains("is-valid")
    )
        ? btnShippingConfirm.removeAttribute('disabled')
        : btnShippingConfirm.setAttribute('disabled', "");
}

inpCity.oninput = function(e) {
    /^[A-Za-z]{3,30}$/.test(this.value)
        ? setValidClass(this)
        : setInValidClass(this);

    checkDisableShippingConfirm();
};
inpCity.onchange = inpCity.oninput;

inpAddress.oninput = function() {
    /^[A-Za-z0-9\s\.\,\/]{7,30}$/.test(this.value)
        ? setValidClass(this)
        : setInValidClass(this);

    checkDisableShippingConfirm();
};

inpPhone.oninput = function(e) {
    this.value = e.target.value.replace(/[^\d]/g, '');

    let val = this.value.split(/(..)?(...)?(...)?(..)?(..)?/).filter(n => !!n);

    val = val.map((numGroup, index) => {
        switch (index) {
            case 0:
                return "+" + numGroup;
            case 1:
                return " (" + numGroup;
            case 2:
                return ") " + numGroup;
            case 3:
                return "-" + numGroup;
            case 4:
                return "-" + numGroup;
            default:
                return "";
        }
    });

    this.value = val.filter(n => !!n).join("");

    /^\+[0-9]{2}\s\([0-9]{3}\)\s[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(this.value)
        ? setValidClass(this)
        : setInValidClass(this);

    checkDisableShippingConfirm();
};
// ===== END SHIPPING TAB =====


// ===== PAYMENT TAB =====
const imgCardSystem = document.getElementById("cc-img");
const divCardHolder = document.getElementById("cc_holder");
const divCardExpire = document.getElementById("cc_expire");
const divCardNumber = document.getElementById("cc_number");
const btnPaymentConfirm = document.getElementById("payment_confirm");

const inpHolder = document.getElementById("holder");
const inpNumber = document.getElementById("number");
const inpExpire = document.getElementById("expire");
const inpCVV = document.getElementById("cvv");

function checkDisablePaymentConfirm() {
    (
        inpNumber.classList.contains('is-valid')
        && inpHolder.classList.contains('is-valid')
        && inpExpire.classList.contains('is-valid')
        && inpCVV.classList.contains('is-valid')
    )
        ? btnPaymentConfirm.removeAttribute('disabled')
        : btnPaymentConfirm.setAttribute('disabled', "");
}

inpHolder.oninput = function(e) {
    this.value = e.target.value.replace(/[^A-Za-z\s]/g, '').trimStart();

    let val = this.value.split(' ');

    val = val.map(holderName => {
        return !holderName.length ? '' : holderName[0].toUpperCase() + holderName.slice(1).toLowerCase();
    });

    if (val.length >= 2) this.value = val[0] + " " + val[1];
    else this.value = val[0];

    if (this.value.length > 25) this.value = this.value.slice(0, 25);

    divCardHolder.innerText = !!this.value ? this.value.toUpperCase() : 'HOLDER NAME';

    /^[A-Z][a-z]+\s[A-Z][a-z]+$/.test(this.value)
        ? setValidClass(this)
        : setInValidClass(this);

    checkDisablePaymentConfirm();
}

inpNumber.oninput = function(e) {
    this.value = e.target.value.replace(/[^0-9]/g, '').slice(0,16);

    let num = this.value + 'X'.repeat(16 - this.value.length);
    num = num.split(/(....)/).filter(n => !!n);

    this.value = this.value.split(/(....)/).filter(n => !!n).join(" ");

    switch (this.value[0]) {
        case '4':
            imgCardSystem.src = "./assets/img/visa.png";
            break;
        case '5':
            imgCardSystem.src = "./assets/img/mastercard.png";
            break;
        default:
            break;

    }

    divCardNumber.innerText = num.join("-");

    /^[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/.test(this.value)
        ? setValidClass(this)
        : setInValidClass(this);

    checkDisablePaymentConfirm();
}

inpExpire.oninput = function(e) {
    let val = e.target.value.replace(/[^0-9\/]/g, '').slice(0, 5);

    if (val.length === 2) {
        if (e.inputType !== 'deleteContentBackward') val += "/";

        let monthNun = parseInt(val);
        if (monthNun <= 0 || monthNun > 12) val = val[0];
    }

    if (val.length === 3 && e.inputType === 'insertText') val = val.slice(0, 2) + "/" + val[2];

    if (val.length === 5) {
        let yearNum = parseInt(val.slice(3));
        let currentYearNum = new Date().getFullYear() % 2000;

        if (yearNum < currentYearNum) val = val.slice(0, 4);
    }

    // console.log(val);
    let pattern = [
        /[01]/g,
        /[0-9]/g,
        /\//g,
        /[2-9]/g,
        /[0-9]/g
    ];

    let isValid = true;
    for (let i = 0; i < val.length; i++) {
        if (!pattern[i].test(val[i])) isValid = false;
    }
    this.value = isValid ? val : val.slice(0, -1);

    divCardExpire.innerText = this.value + 'MM/YY'.slice(this.value.length);

    /^[01][0-9]\/[2-9][0-9]$/.test(this.value)
        ? setValidClass(this)
        : setInValidClass(this);

    checkDisablePaymentConfirm();
}

inpCVV.oninput = function(e) {
    this.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4).trim();

    /^[0-9]{3,4}$/.test(this.value)
        ? setValidClass(this)
        : setInValidClass(this);

    checkDisablePaymentConfirm();
}
// ===== END PAYMENT TAB =====


// ===== INIT SOME EVENTS AND FILL DEFAULT DATA =====
btnOrderConfirm.onclick = function(e) {
    e.preventDefault();
    const confirmTrigger = new bootstrap.Tab(document.getElementById("shipping-tab"));
    confirmTrigger.show();
}

btnShippingConfirm.onclick = function(e) {
    e.preventDefault();
    const confirmTrigger = new bootstrap.Tab(document.getElementById("payment-tab"));
    confirmTrigger.show();
}

document.getElementById("payment_confirm").onclick = function(e) {
    e.preventDefault();
    const confirmTrigger = new bootstrap.Tab(document.getElementById("confirmation-tab"));
    confirmTrigger.show();
}

document.getElementById("shipping_previous").onclick = function(e) {
    e.preventDefault();
    const confirmTrigger = new bootstrap.Tab(document.getElementById("order-tab"));
    confirmTrigger.show();
}

document.getElementById("payment_previous").onclick = function(e) {
    e.preventDefault();
    const confirmTrigger = new bootstrap.Tab(document.getElementById("shipping-tab"));
    confirmTrigger.show();
}

window.onload = function() {
    inpOrderCount.value = 1;
    spanOrderPrice.innerText = String(PRICE);
    spanPaymentConfirm.innerText = String(PRICE * inpOrderCount.value);
}
// ===== INIT EVENTS AND FILL DEFAULT DATA =====
