from pydantic import BaseModel, Field
from typing import List


class TransformInput(BaseModel):
    a: float
    b: float
    c: float
    d: float
    enabled: bool = True


class GridInput(BaseModel):
    extent: float = Field(gt=0, description="Half span of the grid in both axes")
    step: float = Field(gt=0, description="Distance between adjacent grid lines")


class PreviewRequest(BaseModel):
    grid: GridInput
    transforms: List[TransformInput]


class LayerResponse(BaseModel):
    index: int
    matrix: List[List[float]]
    lines: List[List[float]]


class PreviewResponse(BaseModel):
    layers: List[LayerResponse]
