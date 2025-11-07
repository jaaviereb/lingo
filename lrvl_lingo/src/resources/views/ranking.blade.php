<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ranking</title>
  <link rel="stylesheet" href="{{ asset('stylesranking.css') }}">
</head>
<body>
  <nav class="barra">
    <a href="{{ url()->current() }}" class="logo">
      <img src="{{ asset('logo.png') }}" alt="Logo Lingo" />
    </a>

    <div class="nav-botones">
      <form method="POST" action="{{ route('logout') }}" class="logout-form">
        @csrf
        <button type="submit" class="cerrar-sesion">Cerrar sesión</button>
      </form>
    </div>
  </nav>

  <h1>Ranking de Jugadores</h1>

  <table>
    <thead>
      <tr>
        <th>Posición</th>
        <th>Nombre</th>
        <th>Puntuación</th>
      </tr>
    </thead>
    <tbody>
      @foreach ($usuarios as $index => $user)
        <tr>
          <td>{{ $index + 1 }}</td>
          <td>{{ $user->name }}</td>
          <td>{{ $user->score }}</td>
        </tr>
      @endforeach
    </tbody>
  </table>

  <a href="{{ route('main') }}" class="volver">Volver al juego</a>
</body>
</html>
