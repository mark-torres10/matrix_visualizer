from __future__ import annotations

import math
from typing import Iterable, List, Sequence, Tuple

Matrix = Tuple[Tuple[float, float], Tuple[float, float]]
Segment = Tuple[float, float, float, float]


def identity_matrix() -> Matrix:
    return ((1.0, 0.0), (0.0, 1.0))


def matrix_from_values(values: Sequence[float]) -> Matrix:
    a, b, c, d = values
    return ((a, b), (c, d))


def multiply_matrices(left: Matrix, right: Matrix) -> Matrix:
    return (
        (
            left[0][0] * right[0][0] + left[0][1] * right[1][0],
            left[0][0] * right[0][1] + left[0][1] * right[1][1],
        ),
        (
            left[1][0] * right[0][0] + left[1][1] * right[1][0],
            left[1][0] * right[0][1] + left[1][1] * right[1][1],
        ),
    )


def compose_prefix_matrices(transforms: Iterable[Sequence[float]]) -> List[Matrix]:
    result: List[Matrix] = []
    current: Matrix = identity_matrix()
    for transform in transforms:
        matrix = matrix_from_values(transform)
        current = multiply_matrices(matrix, current)
        result.append(current)
    return result


def apply_matrix_to_point(matrix: Matrix, x: float, y: float) -> Tuple[float, float]:
    return (
        matrix[0][0] * x + matrix[0][1] * y,
        matrix[1][0] * x + matrix[1][1] * y,
    )


def apply_matrix_to_segments(matrix: Matrix, segments: Iterable[Segment]) -> List[List[float]]:
    transformed = []
    for x1, y1, x2, y2 in segments:
        tx1, ty1 = apply_matrix_to_point(matrix, x1, y1)
        tx2, ty2 = apply_matrix_to_point(matrix, x2, y2)
        transformed.append([tx1, ty1, tx2, ty2])
    return transformed


def generate_grid_segments(extent: float, step: float) -> List[Segment]:
    if extent <= 0 or step <= 0:
        return []
    lines: List[Segment] = []
    count = int(math.floor(extent / step))
    positions = [i * step for i in range(-count, count + 1)]
    if not positions:
        return []
    y_min = positions[0]
    y_max = positions[-1]
    for x in positions:
        lines.append((x, y_min, x, y_max))
    for y in positions:
        lines.append((positions[0], y, positions[-1], y))
    return lines


def matrix_to_nested_list(matrix: Matrix) -> List[List[float]]:
    return [[matrix[0][0], matrix[0][1]], [matrix[1][0], matrix[1][1]]]
