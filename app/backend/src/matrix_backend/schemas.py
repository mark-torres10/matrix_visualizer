from pydantic import BaseModel, Field, conlist
from typing import List

MAX_GRID_EXTENT = 100.0
MIN_GRID_STEP = 0.2
MAX_GRID_STEP = 10.0
MAX_TRANSFORMS = 32


class TransformInput(BaseModel):
    a: float
    b: float
    c: float
    d: float
    enabled: bool = True


class GridInput(BaseModel):
    extent: float = Field(
        gt=0,
        le=MAX_GRID_EXTENT,
        description="Half span of the grid in both axes",
    )
    step: float = Field(
        ge=MIN_GRID_STEP,
        le=MAX_GRID_STEP,
        description="Distance between adjacent grid lines",
    )


class PreviewRequest(BaseModel):
    grid: GridInput
    transforms: conlist(TransformInput, min_length=0, max_length=MAX_TRANSFORMS)


class LayerResponse(BaseModel):
    index: int
    matrix: List[List[float]]
    lines: List[List[float]]


class PreviewResponse(BaseModel):
    layers: List[LayerResponse]
