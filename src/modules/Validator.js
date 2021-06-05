export default class FormValidator {
    static CHECKS = {
        MIN_LENGTH: {
            exp: /^.{3,}$/,
            err: 'Минимальная длина - 3 символа'
        },
        MAX_LENGTH: {
            exp: /^.{0,25}$/,
            err: 'Максимальная длина - 25 символов'
        },
        ALPHABETIC: {
            exp: /^[a-zA-Zа-яА-ЯёЁ-]*$/,
            err: 'Только буквы'
        },
        ALPHANUMERIC: {
            exp: /^[a-zA-Zа-яА-ЯёЁ0-9_-]*$/,
            err: 'Недопустимые символы'
        },
        REQUIRED: {
            exp: /^.{1,}$/,
            err: 'Не может быть пустым'
        },
        EMAIL: {
            exp: /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i,
            err: 'Недопустимый формат email'
        },
        PHONE: {
            exp: /^\+?(\d{1,3})?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/,
            err: 'Недопустимый формат номера'
        },
        PASSWORD_STRENGTH: {
            USE_LOWER_CASE: {
                exp: /(?=.*[a-z])/,
                err: 'Используйте хотя бы одну строчную букву'
            },
            USE_UPPER_CASE: {
                exp: /(?=.*[A-Z])/,
                err: 'Используйте хотя бы одну заглавную букву'
            },
            USE_NUMERIC: {
                exp: /(?=.*[0-9])/,
                err: 'Используйте хотя бы одну цифру'
            },
            MIN_LENGTH_8: {
                exp: /(?=.{8,})/,
                err: 'Пароль должен быть не короче 8 символов'
            }
        }
    }

    static inputEvents = ['blur', 'keydown', 'keyup'];

    constructor(_rules) {
        this._form = null;
        this._inputs = null;
        this._dataHandler = null;
    }

    attach(root, selector) {
        const form = root.querySelector(selector);
        if (!form)
            throw new Error(`${this.constructor.name}: Form "${selector}" not found`);
        const inputs = form.querySelectorAll('input');
        if (inputs.length === 0)
            throw new Error(`${this.constructor.name}: Form "${selector}" has no input fields`);
        this._form = form;
        this._inputs = inputs;
        this._bindListeners();
    }

    detach() {
        this._unbindListeners();
        this._form = null;
        this._inputs = null;
    }

    setDataHandler(callback) {
        this._dataHandler = callback;
    }

    _handle() {
        const data = {};
        if (!(this._inputs && this._dataHandler))
            return;
        this._inputs.forEach(input => data[input.name] = input.value);
        this._dataHandler(data);
    }

    _bindListeners() {
        if (!(this._inputs && this._form))
            return;
        FormValidator.inputEvents.forEach(event => {
            this._inputs.forEach((input) => input.addEventListener(`${event}`, this._validate.bind(this)));
        });
        this._form.addEventListener('submit', this._submitHandler.bind(this));
    }

    _unbindListeners() {
        if (!(this._inputs && this._form))
            return;
        FormValidator.inputEvents.forEach(event => {
            this._inputs.forEach((input) => input.removeEventListener(`${event}`, this._validate.bind(this)));
        });
        this._form.removeEventListener('submit', this._submitHandler.bind(this));
}

    _validate(event) {
        const input = event.target;
        if (!this._rules.hasOwnProperty(input.name))
            return true;

        let errorField = null;

        if (input.parentNode)
            errorField = input.parentNode.querySelector('.form__error');

        let err = null;

        this._rules[input.name].forEach((rule) => {
            const regExp = new RegExp(rule.exp);
            if (!regExp.test(input.value))
                err = rule.err;
        });

        if (err) {
            if (errorField) {
                errorField.textContent = err;
                errorField.classList.remove('form__error_hidden');
            }
            return false;
        }

        if (errorField)
            errorField.classList.add('form__error_hidden');
        return true;
    }

    _submitHandler(event)
    {
        event.preventDefault();
        if (!this._inputs)
            return;
        let isValid = true;
        this._inputs.forEach((input) => {
            const pseudoEvent = {target: input};
            if (!this._validate(pseudoEvent))
                isValid = false;
        });
        if (isValid)
            this._handle();
    }
}