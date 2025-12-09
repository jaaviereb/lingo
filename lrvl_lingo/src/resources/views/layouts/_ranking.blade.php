@extends('layouts.app')

@section('content')
<div class="ranking-container">
  <h1>Ranking de Jugadores</h1>
  <table>
    <thead>
      <tr>
        <th>Puesto</th>
        <th>Usuario</th>
        <th>Puntuación</th>
      </tr>
    </thead>
    <tbody>
      @foreach ($usuarios as $index => $usuario)
        <tr>
          <td>{{ $index + 1 }}</td>
          <td>{{ $usuario->name }}</td>
          <td>{{ $usuario->score }}</td>
        </tr>
      @endforeach
    </tbody>
  </table>
</div>
@endsection
