export default class AuthForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isLogin = true;
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        const form = this.shadowRoot.querySelector('form');
        const toggleButton = this.shadowRoot.querySelector('.toggle-form');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            if (!this.isLogin) {
                data.name = formData.get('name');
            }

            try {
                const response = await fetch(`/api/auth/${this.isLogin ? 'login' : 'register'}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', result.token);
                    window.location.href = '/';
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                this.showError(error.message);
            }
        });

        toggleButton.addEventListener('click', () => {
            this.isLogin = !this.isLogin;
            this.render();
            this.addEventListeners();
        });
    }

    showError(message) {
        const errorDiv = this.shadowRoot.querySelector('.error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 400px;
                    margin: 2rem auto;
                    padding: 2rem;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    border-radius: 8px;
                }
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                input {
                    padding: 0.5rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                button {
                    padding: 0.5rem;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                button:hover {
                    background: #45a049;
                }
                .error {
                    color: red;
                    display: none;
                    margin-bottom: 1rem;
                }
                .toggle-form {
                    background: none;
                    border: none;
                    color: #2196F3;
                    cursor: pointer;
                    padding: 0;
                    margin-top: 1rem;
                }
            </style>
            <div class="auth-form">
                <h2>${this.isLogin ? 'Login' : 'Register'}</h2>
                <div class="error"></div>
                <form>
                    ${!this.isLogin ? `
                        <input type="text" name="name" placeholder="Name" required>
                    ` : ''}
                    <input type="email" name="email" placeholder="Email" required>
                    <input type="password" name="password" placeholder="Password" required>
                    <button type="submit">${this.isLogin ? 'Login' : 'Register'}</button>
                </form>
                <button class="toggle-form">
                    ${this.isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                </button>
            </div>
        `;
    }
}