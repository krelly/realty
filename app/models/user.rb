class User < ActiveRecord::Base
  has_secure_password

  before_save { self.email.try(:downcase!) }

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  VALID_PHONE_REGEX = /\(\d{3}\)\s\d{3}-\d{2}-\d{2}/
  validates :name,  presence: true, length: { maximum: 50 }
  validates :email, presence: true, format: { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }
  validates :phone_number, presence: true, format: { with: VALID_PHONE_REGEX}
end
