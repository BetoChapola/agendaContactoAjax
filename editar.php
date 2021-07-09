<?php
include 'inc/funciones/funciones.php';
include 'inc/layout/header.php';
// Cuando mandamos id desde el index, el id viene como string, debemos convertirlo en entero:
$id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
if (!$id) {
    die('No es un valor valido.');
}

// Recuerda que estas variabes siguen vivas en el formulario, ya que son parte añadida de la misma
// pagina desde otro archivo:  <?php include 'inc/layout/formulario.php'
$resultado = obtenerContacto($id);
$contacto = $resultado->fetch_assoc();
?>
<pre>
    <?php var_dump($contacto) ?>
</pre>
<div class="contenedor-barra">
    <div class="contenedor barra">
        <a href="index.php" class="btn volver">Volver</a>
        <h1>Editar Contacto</h1>
    </div>
</div>

<div class="bg-amarillo contenedor sombra">
    <form action="#" id="contacto">
        <legend>Edite el contacto.</span></legend>

        <!-- Recuerda que las variables siguen vivas en el formulario -->
        <?php include 'inc/layout/formulario.php' ?>
    </form>
</div>

<?php include 'inc/layout/footer.php' ?>