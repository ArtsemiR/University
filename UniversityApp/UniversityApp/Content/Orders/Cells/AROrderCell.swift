//
//  AROrderCell.swift
//  UniversityApp
//
//  Created by Artsemi Ryzhankou on 6/2/19.
//  Copyright © 2019 Artsemi Ryzhankou. All rights reserved.
//

import UIKit
import Alamofire
import AlamofireImage

class AROrderCell: UIView {
    let insets: UIEdgeInsets = UIEdgeInsets(top: 8, left: 10, bottom: 10, right: 8)

    var model: AROrderModel? {
        didSet {
            Alamofire.request(model?.photoURL ?? "").responseImage { response in
                if let image = response.result.value {
                    self.orderImage.image = image
                }
            }
            descriptionLabel.text = model?.description
            likesLabel.text = "\(model?.rating.likes.count ?? 0)"
            dislikesLabel.text = "\(model?.rating.dislikes.count ?? 0)"
            commentsLabel.text = "\(model?.comments.count ?? 0) коментариев"
        }
    }

    lazy var orderImage: UIImageView = {
        let image = UIImageView()
        image.contentMode = .scaleAspectFit
        image.layer.cornerRadius = 20
        image.layer.masksToBounds = true
        return image
    }()

    lazy var descriptionLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.systemFont(ofSize: 14, weight: UIFont.Weight.regular)
        label.numberOfLines = 0
        return label
    }()

    lazy var likeImage: UIImageView = {
        let image = UIImageView()
        image.contentMode = .scaleAspectFit
        image.image = UIImage(named: "like")
        return image
    }()

    lazy var likesLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.systemFont(ofSize: 14, weight: UIFont.Weight.regular)
        label.numberOfLines = 1
        return label
    }()

    lazy var dislikeImage: UIImageView = {
        let image = UIImageView()
        image.contentMode = .scaleAspectFit
        image.image = UIImage(named: "dislike")
        return image
    }()

    lazy var dislikesLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.systemFont(ofSize: 14, weight: UIFont.Weight.regular)
        label.numberOfLines = 1
        return label
    }()

    lazy var commentsImage: UIImageView = {
        let image = UIImageView()
        image.contentMode = .scaleAspectFit
        image.image = UIImage(named: "comments")
        return image
    }()

    lazy var commentsLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.systemFont(ofSize: 14, weight: UIFont.Weight.regular)
        label.numberOfLines = 0
        return label
    }()

    lazy var lineView: UIView = {
        let view = UIView()
        view.backgroundColor = #colorLiteral(red: 0.921431005, green: 0.9214526415, blue: 0.9214410186, alpha: 1)
        return view
    }()

    override init(frame: CGRect) {
        super.init(frame: frame)

        self.setupView()
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    func setupView() {
        backgroundColor = .white
        layer.cornerRadius = 20
        addSubview(orderImage)
        addSubview(descriptionLabel)
        addSubview(lineView)
        addSubview(likeImage)
        addSubview(likesLabel)
        addSubview(dislikeImage)
        addSubview(dislikesLabel)
        addSubview(commentsImage)
        addSubview(commentsLabel)

        orderImage.snp.makeConstraints { (make) in
            make.top.left.right.equalToSuperview().inset(insets)
            make.height.equalTo(250)
        }

        descriptionLabel.snp.makeConstraints { (make) in
            make.top.equalTo(orderImage.snp.bottom).offset(8)
            make.left.right.equalToSuperview().inset(insets)
        }

        lineView.snp.makeConstraints { (m) in
            m.top.equalTo(descriptionLabel.snp.bottom).offset(8)
            m.left.right.equalToSuperview().inset(5)
            m.height.equalTo(1)
        }

        likeImage.snp.makeConstraints { (m) in
            m.top.equalTo(lineView.snp.bottom).offset(8)
            m.left.bottom.equalToSuperview().inset(insets)
            m.size.equalTo(20)
        }
        likesLabel.snp.makeConstraints { (m) in
            m.left.equalTo(likeImage.snp.right).offset(5)
            m.centerY.equalTo(likeImage)
        }

        dislikeImage.snp.makeConstraints { (m) in
            m.left.equalTo(likesLabel.snp.right).offset(20)
            m.size.equalTo(20)
            m.centerY.equalTo(likeImage)
        }
        dislikesLabel.snp.makeConstraints { (m) in
            m.left.equalTo(dislikeImage.snp.right).offset(5)
            m.centerY.equalTo(likeImage)
        }

        commentsLabel.snp.makeConstraints { (m) in
            m.right.equalToSuperview().inset(insets)
            m.centerY.equalTo(likeImage)
        }
        commentsImage.snp.makeConstraints { (m) in
            m.right.equalTo(commentsLabel.snp.left).offset(-5)
            m.centerY.equalTo(likeImage)
            m.size.equalTo(20)
        }
    }
}
