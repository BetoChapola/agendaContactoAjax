<?php

function obtenerContactos(){
    include 'bd.php';
    try {
        return $conn->query("SELECT id_contactos, nombre, empresa, telefono FROM contactos");
    } catch (Exception $e) {
        echo "Error!!!" . $e->getMessage() . '<br>';
        return false;
    }
}

// Obtiene un contacto y toma un ID
function obtenerContacto($id){
    include 'bd.php';
    try {
        return $conn->query("SELECT id_contactos, nombre, empresa, telefono FROM contactos WHERE id_contactos = $id");
    } catch (Exception $e) {
        echo "Error!!!" . $e->getMessage() . '<br>';
        return false;
    }
}