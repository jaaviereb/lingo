<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Lingo') }}</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <!-- CSS personalizado -->
    <link rel="stylesheet" href="{{ asset('index.css') }}">
</head>

<body>
    <header>
        <h1><span class="marca">Lingo</span></h1>
        <p class="subtitulo">Tu puerta al aprendizaje interactivo</p>
    </header>

    <main class="contenedor">
        <section class="tarjeta acceso">
            <h2>Bienvenido</h2>
            <p class="texto">Accede o crea una cuenta para continuar.</p>

            <div class="formulario">
                <a href="{{ route('login') }}" class="boton boton-azul">Iniciar sesión</a>

                @if (Route::has('register'))
                    <a href="{{ route('register') }}" class="boton boton-verde">Registrarse</a>
                @endif
            </div>
        </section>
    </main>

    <footer class="footer-basico">
        <p>&copy; 2025 Lingo. Todos los derechos reservados.</p>
    </footer>
</body>
</html>
