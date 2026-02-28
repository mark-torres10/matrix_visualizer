import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .compute import (
    apply_matrix_to_segments,
    compose_prefix_matrices,
    generate_grid_segments,
    matrix_to_nested_list,
)
from .schemas import LayerResponse, PreviewRequest, PreviewResponse

def get_allowed_origins() -> list[str]:
    defaults = ["http://localhost:3000", "http://127.0.0.1:3000"]
    extra = os.getenv("FRONTEND_ORIGINS")
    if extra:
        defaults.extend(origin for origin in (value.strip() for value in extra.split(",")) if origin)
    return defaults


app = FastAPI(
    title="Matrix Desmos Backend",
    version="0.1.0",
    description="Computes intermediate 2x2 transform layers for the UI",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/preview", response_model=PreviewResponse)
def preview(request: PreviewRequest):
    enabled_transforms = [
        (t.a, t.b, t.c, t.d) for t in request.transforms if t.enabled
    ]
    prefixes = compose_prefix_matrices(enabled_transforms)
    base_segments = generate_grid_segments(request.grid.extent, request.grid.step)
    layers = []
    for index, matrix in enumerate(prefixes, start=1):
        layers.append(
            LayerResponse(
                index=index,
                matrix=matrix_to_nested_list(matrix),
                lines=apply_matrix_to_segments(matrix, base_segments),
            )
        )
    return PreviewResponse(layers=layers)
