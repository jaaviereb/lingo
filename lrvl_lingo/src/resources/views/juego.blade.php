<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Lingo</title>

    <link rel="stylesheet" href="{{ asset('styles.css') }}">
    <script src="{{ asset('script.js') }}" defer></script>
</head>


<body class="juego">
    <nav class="barra">
      <a href="{{ url()->current() }}" class="logo">
            <img src="{{ asset('logo.png') }}" alt="Logo Lingo" />
        </a>


        <div class="nav-botones">
            <a href="{{ route('ranking') }}" class="ranking">Ranking</a>

            <form method="POST" action="{{ route('logout') }}" class="logout-form">
                @csrf
                <button type="submit" class="cerrar-sesion">Cerrar sesión</button>
            </form>
        </div>
    </nav>

    <main>
        <h1 class="titulo">¡Adivina la palabra!</h1>
        <div id="temporizador">Tiempo restante por fila: 30s</div>



        <section class="tabla-contenedor">
            @for ($i = 0; $i < 25; $i++)
                <div class="celda"></div>
            @endfor
        </section>

        <section id="teclado-pantalla">
            <div class="fila-teclas">
                @foreach (['Q','W','E','R','T','Y','U','I','O','P'] as $tecla)
                    <button class="tecla">{{ $tecla }}</button>
                @endforeach
            </div>

            <div class="fila-teclas">
                @foreach (['A','S','D','F','G','H','J','K','L','Ñ'] as $tecla)
                    <button class="tecla">{{ $tecla }}</button>
                @endforeach
            </div>

            <div class="fila-teclas">
                @foreach (['Z','X','C','V','B','N','M','⌫'] as $tecla)
                    <button class="tecla">{{ $tecla }}</button>
                @endforeach
            </div>
        </section>
    </main>
    <footer class="footer-basico">
        <p>&copy; 2025 Lingo. Todos los derechos reservados.</p>
    </footer>
</body>
</html>
