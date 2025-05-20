import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

function Home() {
    return (
        <body className='mainguard auth'>
            <header>
                <div class="container">
                    <h1 id='main-headline'>КредитOnline</h1>
                </div>
                <nav>
                    <Link to='/auth'>
                        <div className='navigate-element'>Control panel</div>
                    </Link>
                </nav>
            </header>
            
            <section class="hero">
                <div class="container">
                    <h2>Кредит на любые цели до 1 000 000 ₽</h2>
                    <p>Одобрение за 5 минут | Ставка от 5.9%</p>
                    <button class="cta-button">Оформить заявку</button>
                </div>
            </section>
            
            <div class="container">
                <section class="features">
                    <div class="feature-card">
                        <h3>📱 Онлайн-заявка</h3>
                        <p>Без визита в банк</p>
                    </div>
                    <div class="feature-card">
                        <h3>⚡ Быстрое решение</h3>
                        <p>Ответ за 5 минут</p>
                    </div>
                    <div class="feature-card">
                        <h3>💳 Любая кредитная история</h3>
                        <p>Выдаём даже с просрочками</p>
                    </div>
                </section>
            </div>
        </body>
    );
}

export default Home;