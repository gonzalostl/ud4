// Importamos el framework express.
const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;

// Iniciamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});

dbconnect();

app.get("/concesionarios", async (request, response) => {
  try {
    const concesionario = await concesionarios.find();
    response.json(concesionario);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

// Añadir un nuevo concesionario

app.post("/concesionarios", async (request, response) => {
  const nuevoConcesionario = new concesionarios(request.body);
  try {
    const concesionarioGuardado = await nuevoConcesionario.save();
    response.json(concesionarioGuardado);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

// Obtener un solo concesionario
app.get("/concesionarios/:id", async (request, response) => {
  try {
    const concesionario = await concesionarios.findById(request.params.id);
    if (!concesionario) {
      return response.status(404).json({ message: "Concesionario inválido" });
    }
    response.json(concesionario);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

// Actualizar un solo concesionario
app.put("/concesionarios/:id", async (request, response) => {
  try {
    const concesionario = await concesionarios.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
    });
    if (!concesionario) {
      return response.status(404).json({ message: "Concesionario inválido" });
    }
    response.json(concesionario);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

// Borrar un concesionario
app.delete("/concesionarios/:id", async (request, response) => {
  try {
    const concesionario = await concesionarios.findByIdAndDelete(request.params.id);
    if (!concesionario) {
      return response.status(404).json({ message: "Concesionario inválido" });
    }
    response.json({ message: "Concesionario eliminado correctamente" });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

// Lista todos los coches de un concesionario
app.get("/concesionarios/:id/coches", async (request, response) => {
  try {
    const concesionario = await concesionarios.findById(request.params.id).populate("listCoches");
    if (!concesionario) {
      return response.status(404).json({ message: "Concesionario inválido" });
    }
    response.json(concesionario.listCoches);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

//Añadir coches a un concesionario
app.post("/concesionarios/:id/coches", async (request, response) => {
  try {
    const concesionario = await concesionarios.findById(request.params.id);

    if (!concesionario) {
      return response.status(404).json({ message: "Concesionario inválido" });
    }

    const nuevoCoche = {
      marca: request.body.marca,
      modelo: request.body.modelo,
    };

    concesionario.listCoches.push(nuevoCoche);
    await concesionario.save();

    response.json(nuevoCoche);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

// Obtener un solo coche de un concesionario
app.get("/concesionarios/:id/coches/:cocheId", async (request, response) => {
  try {
    const cocheId = request.params.cocheId;
    const concesionario = await concesionarios.findById(request.params.id);
    if (!concesionario) {
      return response.status(404).json({ message: "Concesionario inválido" });
    }

    const coche = concesionario.listCoches[cocheId];
    if (!coche) {
      return response.status(404).json({ message: "Coche inválido" });
    }

    response.json(coche);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

// Actualizar un solo coche de un concesionario
app.put("/concesionarios/:id/coches/:cocheId", async (request, response) => {
  try {
    const cocheId = request.params.cocheId;
    const concesionario = await concesionarios.findById(request.params.id);

    if (!concesionario) {
      return response.status(404).json({ message: "Concesionario inválido" });
    }

    if (cocheId < 0 || cocheId >= concesionario.listCoches.length) {
      return response.status(404).json({ message: "Coche inválido" });
    }

    concesionario.listCoches[cocheId] = {
      marca: request.body.marca || concesionario.listCoches[cocheId].marca,
      modelo: request.body.modelo || concesionario.listCoches[cocheId].modelo,
    };

    await concesionario.save();

    response.json(concesionario.listCoches[cocheId]);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

// Borrar un coche de un concesionario
app.delete("/concesionarios/:id/coches/:cocheId", async (request, response) => {
  try {
    const cocheId = request.params.cocheId;
    const concesionario = await concesionarios.findById(request.params.id);

    if (!concesionario) {
      return response.status(404).json({ message: "Concesionario inválido" });
    }

    if (cocheId < 0 || cocheId >= concesionario.listCoches.length) {
      return response.status(404).json({ message: "Coche inválido" });
    }

    concesionario.listCoches.splice(cocheId, 1);
    await concesionario.save();

    response.json({ message: "Coche eliminado correctamente" });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});
