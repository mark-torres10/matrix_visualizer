from typing import Sequence

import pytest

from matrix_backend.compute import apply_matrix_to_segments, compose_prefix_matrices

Segment = Sequence[float]


def approx_matrix(matrix, expected, tol=1e-6):
    return all(abs(a - b) < tol for row_a, row_b in zip(matrix, expected) for a, b in zip(row_a, row_b))


def approx_segments(segments_a, segments_b, tol=1e-6):
    return all(abs(a - b) < tol for seg_a, seg_b in zip(segments_a, segments_b) for a, b in zip(seg_a, seg_b))


def test_prefix_composition_order():
    transforms = [
        (2.0, 0.0, 0.0, 1.0),
        (1.0, 0.0, 0.0, 3.0),
    ]
    prefixes = compose_prefix_matrices(transforms)
    assert len(prefixes) == 2
    assert approx_matrix(prefixes[0], [[2.0, 0.0], [0.0, 1.0]])
    assert approx_matrix(prefixes[1], [[2.0, 0.0], [0.0, 3.0]])


def test_identity_preserves_segments():
    identity = [[1.0, 0.0], [0.0, 1.0]]
    segments = [[0.0, 0.0, 1.0, 0.0]]
    transformed = apply_matrix_to_segments(identity, segments)
    assert approx_segments(transformed, segments)


def test_rotation_outputs_expected_endpoint():
    rotation = [[0.0, -1.0], [1.0, 0.0]]
    segment = [[0.0, 0.0, 1.0, 0.0]]
    transformed = apply_matrix_to_segments(rotation, segment)
    assert approx_segments(transformed, [[0.0, 0.0, 0.0, 1.0]])
