class Restaurant < ApplicationRecord
    has_many :foods
    has_many :line_foods, through: :foods

    validates :name, :fee, :time_required, presence: true
    DEFAULT_NAME_LENGTH = 30
    validates :name, length: { maximum: DEFAULT_NAME_LENGTH }
    validates :fee, numericality: { greater_than: 0 }
end