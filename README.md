Фреймворк для автоматизации тестирования ui, с использованием селениума 
и bdd-стиль описания тестов.

Примеры тестов можно посмотреть в tests/aviasales.ts

Запуск ts-node index.ts

**Что реализовано:**

- Создание page-objects (пока без декораторов - с использованием new)

- Автоматическая сборка page-objects по пути

- Работа внутри тестов по именам и "бизнес сущностям"

- Работа с ресурсами

- Автоматическое открытие/закрытие драйвера

- Единый раннер тестов

- Базовая работа с элементами

- Ожидания прогрузки страницы

- Разделение тестового проекта и фреймворка автотестирования

- Имена для тестов

**Что не реализовано:**

- Работа с capabilities

- Использование других драйверов (кроме хрома)

- Использование драйвера по заданному пути (а не из npm)

- Логгирование

- Работа с комплексными объектами

- Распараллеливание

- В коде тестов необходимо использование await

- Декораторы для страниц

- Имена для наборов, группировка тестов, создание сложных запусков

- Логгирование/обработка ошибок



